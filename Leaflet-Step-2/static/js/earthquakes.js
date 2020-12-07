// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var queryUrl2 = "static/data/PB2002_plates.json";

console.log(queryUrl)

// Perform a GET request to the query two URLs
Promise.all([d3.json(queryUrl), d3.json(queryUrl2)]).then(function(data){
 

    console.log("Earthquakes", data[0])
    console.log("Plates", data[1])


    var earthquakes = L.geoJSON(data[0].features, 
      {pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, earthquakeStyle(feature));
      },
      onEachFeature : addPopup
    });

    
  
    var plates = L.geoJSON(data[1].features, {
      style: plateStyle,
      onEachFeature : addPopupPlate
    });

    //create legend for earthquake layer
    var earthquakesLegend = L.control({position: 'bottomright'});
    earthquakesLegend.onAdd = function (myMap) {
  
        var div = L.DomUtil.create('div', 'info earthquakes legend'),
        depthArray = [-10, 10, 30, 50, 70, 90],
        labels = [];
  
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depthArray.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depthArray[i] + 1) + '  "></i> ' + '&nbsp&nbsp&nbsp' +
                depthArray[i] + (depthArray[i + 1] ? '&ndash;' + depthArray[i + 1] + '<br>' : '+');
        }
  
        return div;
    };
  
    createMap(earthquakes, plates, earthquakesLegend)
  
});



// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h3>${feature.properties.title}</h3> <hr> 
  <p> Magnitude: ${feature.properties.mag}<br>
  Depth: ${feature.geometry.coordinates[2]}<br>
  Earthquake Info: <a href = ${feature.properties.url}>Detailed Earthquake Info</a><br>
  </p>`);
}

//function for popups for tectonic plates
function addPopupPlate(feature, layer) {
  // Give each feature a popup describing the place and time of the earthquake
  return layer.bindPopup(`<h3> ${feature.properties.PlateName} </h3>`);
}




//function to select color based on depth
function getColor(depth){
  return depth > 90 ? '#f03535' :
         depth > 70 ? '#f27227' :
         depth > 50 ? '#f6ac17' :
         depth > 30 ? '#f0de33' :
         depth > 10 ? '#a1f64c' :
                      '#3dc809' ;
         
}


//create styles for earthquakes
function earthquakeStyle(feature) {
  return {
      radius: feature.properties.mag*4,
      fillColor: getColor(feature.geometry.coordinates[2]),
      weight: 2,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.85
  };
}


//create styles for tectonic plates

function plateStyle(feature) {
  return {
      weight: 2,
      opacity: 1,
      color: 'orange',
      fillOpacity: 0
  };
}


function createMap(earthquakes, plates, earthquakesLegend) {

  // Define streetmap and darkmap layers
  var satelliteBase = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  var darkgreyBase = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var outdoorsBase = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite ": satelliteBase,
    "Dark Greyscale": darkgreyBase,
    "Outdoors": outdoorsBase,
    
  };

  // Create overlay object for earthquakes and tectonic plates
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": plates,
    
  };

  // Create our map, giving it the satellite and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [44.53155795563836, -102.61109623371827],
    zoom: 4,
    layers: [satelliteBase, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  earthquakesLegend.addTo(myMap) 

  

}
