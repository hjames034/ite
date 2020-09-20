var toDisp=''
mapboxgl.accessToken = 'pk.eyJ1IjoiamhodWFuZzciLCJhIjoiY2s4cGFwM3ozMDJoNzNscHFvamp6MjQycCJ9.vR5I6JNs24iJIhMI3KJCtA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/jhhuang7/ck9litj340me81jqt602vlphn',
center: [-118.282, 34.023],
zoom: 13.60
});
 
var featureLength=0
 
function loadLegend() {
  $("#right").load("https://iteusc.com/scn2020/assets/legend.html");
}
function loadInfo() {
 $("#right").load("https://iteusc.com/scn2020/assets/information.html");

}
 
map.on('load', function() {
map.addSource('transit-stations', {
type: 'geojson',
data: 'https://opendata.arcgis.com/datasets/6679d1ccc3744a7f87f7855e7ce33395_1.geojson'
});
map.addSource('census-2010', {
  type: 'geojson',
  data: 'https://opendata.arcgis.com/datasets/4710924da7ee491ca65f0f830abf0bc0_0.geojson'
});
map.addLayer({
'id': 'transit-station',
'type': 'circle',
'source': 'transit-stations',
'paint': {
'circle-color': '#888888',
'circle-opacity': 0.01
}
});
map.addLayer({
'id': 'census-bound',
'type': 'fill',
'source': 'census-2010',
'paint': {
'fill-color': '#888888',
'fill-opacity': 0.01
},
'filter': ['==', '$type', 'Polygon']
});
//population count
var populationTotal = 0 //total population
var populationArr = map.queryRenderedFeatures({layers:['census-bound']});
var attractions = map.queryRenderedFeatures({layers:['attractions']});
var districtCount=0
populationArr.forEach(aggPop);
function aggPop(feature) {
var district = populationArr[districtCount];
var populationThis = district.properties.POP;
districtCount +=1;
populationTotal+=populationThis;
}
$(function(){
  $("#population").text(populationTotal);
});

//calculate square area and dock/station count
var featureLength = map.queryRenderedFeatures({layers:['bike-route-network-test']}).length;
var dockCount = 0;
var featureList=map.queryRenderedFeatures({layers:['bike-route-network-test']});
var mapBounds = map.getBounds();
var longDist = mapBounds._ne.lng - mapBounds._sw.lng;
var latDist = mapBounds._ne.lat - mapBounds._sw.lat;
var convLongMiles = Math.abs(Math.cos(mapBounds._ne.lat))*69.172*longDist;
var convLatMiles = 69.172*latDist;
var sqArea = convLongMiles * convLatMiles;
var counter=0;
featureList.forEach(findTotal);
function findTotal(feature) {
var test = featureList[counter];
var stationSize = test.properties.size
counter +=1;
try {
dockCount+=stationSize;
}
catch(err) {
dockCount+=10;
}
}
$(function(){
  $("#area").text(sqArea);
});
$(function(){
  $("#density").text(featureLength/sqArea);
});
$(function(){
  $("#stations").text(featureLength);
});
$(function(){
  $("#docks").text(dockCount);
});

    map.on('click', 'bike-route-network-test', function(e) {
var coordinates = e.features[0].geometry.coordinates.slice();
var name = e.features[0].properties.name;
var size = e.features[0].properties.size;
var location = e.features[0].properties.bikestation;
var toDisp = location

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML("<h3>"+name+"</h3><p># of docks: "+size+"</p><p>location type: "+location+"</p>")
.addTo(map);
if (toDisp == 'transit') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/transit.html");
});
}
else if (toDisp == 'commercial-ld') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/commercial-ld.html");
});
}
else if (toDisp == 'commercial') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/commercial.html");
});
}
else if (toDisp == 'residential-ld') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/residential-ld.html");
});
}
else if (toDisp == 'residential') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/residential.html");
});
}
else if (toDisp == 'destination') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/destination.html");
});
}
else {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/commercial-ld.html");
});
}
});
 
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'bike-route-network-test', function() {
map.getCanvas().style.cursor = 'pointer';

});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'bike-route-network-test', function() {
map.getCanvas().style.cursor = '';
});

map.on('click', 'icon', function(e) {
var coordinates = e.features[0].geometry.coordinates.slice();
var recommendeddesign = e.features[0].properties.intersectiontype;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML("<h3>"+recommendeddesign+"</h3>")
.addTo(map);


});
 
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'icon', function() {
map.getCanvas().style.cursor = 'pointer';

});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'icon', function() {
map.getCanvas().style.cursor = '';
});

map.on('click', 'bike-lane', function(e) {
var coordinates = e.features[0].geometry.coordinates.slice()[0];
var recommendeddes = e.features[0].properties.recommendeddesign;
var name= e.features[0].properties.name;
var toDisp = recommendeddes

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}


 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML("<h3>Street:"+name+"<\h3><p>design type:"+recommendeddes+"</p>")
.addTo(map);
if (toDisp == 'A') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/A.html");
});
}
else if (toDisp == 'C') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/C.html");
});
}
else if (toDisp == 'D') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/D.html");
});
}
else if (toDisp == 'E') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/E.html");
});
}
else if (toDisp == 'S') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/S.html");
});
}
else if (toDisp == 'M') {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/M.html");
});
}
else {
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/B.html");
});
}

});
 
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'bike-lane', function() {
map.getCanvas().style.cursor = 'pointer';

});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'bike-lane', function() {
map.getCanvas().style.cursor = '';
});

map.on('click', 'icon', function(e) {
var coordinates = e.features[0].geometry.coordinates.slice()[0];
var recommendeddesign = e.features[0].properties.equityzone;

// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML("<h3>"+recommendeddesign+"</h3>")
.addTo(map);
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/intersection.html");
});


});
 
// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'icon', function() {
map.getCanvas().style.cursor = 'pointer';

});
 
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'icon', function() {
map.getCanvas().style.cursor = '';
});

});
//document.getElementById('stations').innerHTML=featureLength
function statistics() {
var featureLength = map.queryRenderedFeatures({layers:['bike-route-network-test']}).length;
var dockCount = 0;
var featureList=map.queryRenderedFeatures({layers:['bike-route-network-test']});
//population calculations
var populationTotal = 0 //total population
var populationArr = map.queryRenderedFeatures({layers:['census-bound']});
//var attractions = map.queryRenderedFeatures(bbox, {layers:['attractions']});
//university:3 , park: 1.2, destination: 1.5, transit: 1.7
var populationMultTotal = 0
var ridershipArea = 0
var districtCount=0
populationArr.forEach(aggPop);
function aggPop(feature) {
var district = populationArr[districtCount];
var multValue = 1
var userPolygon = district;
 var polygonBoundingBox = turf.bbox(userPolygon);
        var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
        var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];

        var northEastPointPixel = map.project(northEast);
        var southWestPointPixel = map.project(southWest);

        var attrSearch = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['attractions'] });
var transitStaList =map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['transit-station'] });
var attrSearchLength = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['attractions'] }).length;
var transitStaListLength =map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['transit-station'] }).length;
//FIND ATTRACTIONS (IN DATASET)
if (attrSearchLength > 0 ) {
var countAttr = 0;
//alert(attrSearchLength);
attrSearch.forEach(valuePop);
}
else {
var multValue = 1
}
function valuePop(tester) {

var attractionInfo = attrSearch[countAttr].properties.value;
//alert(attractionInfo);
countAttr += 1;
if (attractionInfo == "destination" ) {
multValue += .5;
}
else if (attractionInfo == "transit") {
multValue += .7;
}
else if (attractionInfo == "university" ) {
multValue += 1.1;
}
else if (attractionInfo == "school" ) {
multValue += .2;
}
else if (attractionInfo == "park" ) {
multValue += .1;
}
else {
multValue += .07;
}
}
//FIND TRANSIT STATIONS (in other dataset)
if (transitStaListLength > 0 ) {
var countTransit = 0;
//alert(attrSearchLength);
transitStaList.forEach(valueTrans);
}
function valueTrans(counterTransit) {
multValue +=.7;
}
//RIDERSHIP (demand) METHODOLOGY: Adjusted population * 10% of people who make trips between (1-3 miles) + 3% "other" rides * 80% (population mobile/young enough to understand scooters)

var populationThis = district.properties.POP;
var populationMultThis = populationThis * multValue;
var ridershipThisDist = populationMultThis *.13*.8; //very rudimentary, will refine
districtCount +=1;
populationTotal+=populationThis;
populationMultTotal +=populationMultThis;
ridershipArea += ridershipThisDist;
}

//rudimentary surface area calc
var mapBounds = map.getBounds();
var longDist = mapBounds._ne.lng - mapBounds._sw.lng;
var latDist = mapBounds._ne.lat - mapBounds._sw.lat;
var convLongMiles = Math.abs(Math.cos(mapBounds._ne.lat))*69.172*longDist;
var convLatMiles = 69.172*latDist;
var sqArea = convLongMiles * convLatMiles;

//get number of docks
var counter=0;
featureList.forEach(findTotal);
function findTotal(feature) {
var test = featureList[counter];
var stationSize = test.properties.size
counter +=1;
try {
dockCount+=stationSize;
}
catch(err) {
dockCount+=10;
}
}
document.getElementById('population').innerHTML=populationTotal;
document.getElementById('calc').innerHTML=Math.round(populationMultTotal);
if ( map.queryRenderedFeatures({layers:['bike-route-network-test (3)']}).length != 0) {
document.getElementById('docks').innerHTML=dockCount;
document.getElementById('stations').innerHTML=featureLength;
document.getElementById('ratio').innerHTML=((dockCount / populationTotal ) * 1000).toFixed(2);
document.getElementById('ratioAdj').innerHTML=((dockCount / populationMultTotal ) * 1000).toFixed(2);
document.getElementById('density').innerHTML = (featureLength / sqArea).toFixed(2);
}
else {
document.getElementById('docks').innerHTML="This statistic is not available because it has only been calculated for the study area";
document.getElementById('stations').innerHTML="This statistic is not available because it has only been calculated for the study area";
document.getElementById('ratio').innerHTML="This statistic is not available because it has only been calculated for the study area";
document.getElementById('ratioAdj').innerHTML="This statistic is not available because it has only been calculated for the study area";
document.getElementById('density').innerHTML = "This statistic is not available because it has only been calculated for the study area";
}
document.getElementById('area').innerHTML = sqArea.toFixed(2);
//document.getElementById('density').innerHTML = (featureLength / sqArea).toFixed(2);
if ((populationMultTotal/sqArea) > 25000) {
ridershipArea = ridershipArea * 1.4;
}
document.getElementById('estRidership').innerHTML = ridershipArea.toFixed(2);
//document.getElementById('docks').innerHTML='testmessage';
}
$(function(){
  $("#right").load("https://iteusc.com/scn2020/assets/legend.html");
});
$(function(){
  $("#projectSidebar").load("https://iteusc.com/assets/scn2020/projectSidebar.html");
});
$(function(){
  $("#nav-placeholder").load("https://iteusc.com/assets/navbar.html");
});
$(function(){
  $("#footer").load("https://iteusc.com/assets/footer.html");
})