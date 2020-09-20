var toDisp=''
mapboxgl.accessToken = 'pk.eyJ1IjoiamhodWFuZzciLCJhIjoiY2s4cGFwM3ozMDJoNzNscHFvamp6MjQycCJ9.vR5I6JNs24iJIhMI3KJCtA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-118.282, 34.023],
zoom: 13.60
}); //center map
var config = {
    apiKey: "AIzaSyCPPaxyqvEpYaeyhOlUZ0W9dmfROW4trpc",
    authDomain: "la-ITE-micromobility.firebaseapp.com",
    databaseURL: "https://la-ite-micromobility.firebaseio.com/",
    storageBucket: "la-ite-micromobility.appspot.com"
  };
  firebase.initializeApp(config);

 var userDataRef = firebase.database().ref("features").orderByKey();
userDataRef.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key;
      var childData = childSnapshot.child('geometry').child('coordinates');              // childData will be the actual contents of the child
var c_test = childData.val() //coordinates

      //var name_val = childSnapshot.val().geometry.val().;
      //var id_val = childSnapshot.val().AssignedID;
      $("#name").append(c_test+"<br>");
      //document.getElementById("id").innerHTML = id_val + ", ";
  });
 });
var url = 'https://la-ite-micromobility.firebaseio.com/';
map.on('load', function() {
var request = new XMLHttpRequest();
window.setInterval(function() {
// make a GET request to parse the GeoJSON at the url
request.open('GET', url, true);
request.onload = function() {
if (this.status >= 200 && this.status < 400) {
// retrieve the JSON from the response
var json = JSON.parse(this.response);
 
// update the drone symbol's location on the map
map.getSource('drone').setData(json);
 
// fly the map to the drone's current location
}
};
request.send();
}, 2000);
 
map.addSource('drone', { type: 'geojson', data: url });
map.addLayer({
'id': 'drone',
'type': 'symbol',
'source': 'drone',
'layout': {
'icon-image': 'rocket-15'
}
});
});
 

 