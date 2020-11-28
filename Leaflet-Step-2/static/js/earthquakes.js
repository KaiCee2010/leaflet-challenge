var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function getColor(depth){
  return depth > 90 ? '#f03535' :
         depth > 70 ? '#f27227' :
         depth > 50 ? '#f6ac17' :
         depth > 30 ? '#f0de33' :
         depth > 10 ? '#a1f64c' :
                      '#3dc809' ;
         
}

function createMap(earthquakes){
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var darkGrayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });


  // Create a baseMaps object
  var baseMaps = {
    "Satellite": satelliteMap,
    "Dark Grayscale": darkGrayscaleMap,
    "Outdoors": outdoorsMap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };


  // Create the map object with options
  var myMap = L.map("map", {
    center: [44.53155795563836, -102.61109623371827],
    zoom: 4,
    layers: [satelliteMap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  
}

function createMarkers(response){

  var features = response.features
  

  var earthquakeMarkers = [];

  for (var index = 0; index < features.length; index++) {
    var feature = features[index];

    var geometry = feature.geometry;
    var properties = feature.properties;

    var magnitude = properties.mag 

    var depth = geometry.coordinates[2]

    var earthquakeMarker = L.circle([geometry.coordinates[1], geometry.coordinates[0]],{
      radius: magnitude*7500,
      color: 'black',
      fillColor: getColor(geometry.coordinates[2]),
      fillOpacity: .85,
      weight: 1
    }).bindPopup(`<h3>${properties.title}</h3> <hr> 
    <h5>Status: ${properties.status}<br>
    Earthquake Info: <a href = ${properties.url}>Detailed Earthquake Info</a><br>
    </h5> `)

    earthquakeMarkers.push(earthquakeMarker)
  }

  createMap(L.layerGroup(earthquakeMarkers));

}

d3.json(link).then(response => createMarkers(response));