// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var queryUrl2 = "static/data/PB2002_plates.json";

console.log(queryUrl)

// Perform a GET request to the query URL
Promise.all([d3.json(queryUrl), d3.json(queryUrl2)]).then(function(data){
// d3.json(queryUrl).then(function(data) {
    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    

    console.log("Earthquakes", data[0])
    console.log("Plates", data[1])


    // var magnitude = data[0].features.properties.mag
    // var depth = geometry.coordinates[2]

  //   var geojsonMarkerOptions = {
  //     radius: magnitude*7500,
  //     fillColor: getColor(depth),
  //     color: "#000",
  //     weight: 1,
  //     opacity: .85,
  //     fillOpacity: 0.8
  // }

    var earthquakes = L.geoJSON(data[0].features, 
      {pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style(feature));
      },
      onEachFeature : addPopup
    });

    // var earthquakes = L.geoJSON(data[0].features, { 
    //   style: style,
    //   onEachFeature : addPopup
    // });
  
    var plates = L.geoJSON(data[1].features, {
      onEachFeature : addPopupPlate
    });


    createMap(earthquakes, plates)
  
});



// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}

function addPopupPlate(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h3> ${feature.properties.PlateName} </h3>`);
}

// function to receive a layer of markers and plot them on a map.

function getColor(depth){
  return depth > 90 ? '#f03535' :
         depth > 70 ? '#f27227' :
         depth > 50 ? '#f6ac17' :
         depth > 30 ? '#f0de33' :
         depth > 10 ? '#a1f64c' :
                      '#3dc809' ;
         
}

function style(feature) {
  return {
      radius: feature.properties.mag*4,
      fillColor: getColor(feature.geometry.coordinates[2]),
      weight: 2,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.85
  };
}

function createMap(earthquakes, plates) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Plates": plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [44.53155795563836, -102.61109623371827],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
