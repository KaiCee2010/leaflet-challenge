var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  
  // Add a marker to the map for each crime
  d3.json(link).then(function(response) {
  
    var features = response.features

    console.log(features)
  
    features.forEach(function(data){
        var geometry = data.geometry;
        var properties = data.properties;

        console.log("properties", properties.mag)
        console.log("geometry", geometry)

        var magnitude = properties.mag 

        var depth = geometry.coordinates[2]
    
      // if the location field is populated
        if (geometry) {
            console.log("depth before switch", depth)
            

            if (depth > 90){
                var color = "#f03535"
            }
            else if (depth > 70){
                var color = "#f27227"
            }
            else if (depth > 50){
                var color = "#f6ac17"
            }
            else if (depth > 30){
                var color = "#f0de33"
            }
            else if (depth > 10){
                var color = "#a1f64c"
            }
            else {
                var color = "#3dc809"
            }

            console.log("depth", depth)
            console.log("color", color)


            var myCircle = L.circle([geometry.coordinates[1], geometry.coordinates[0]],{
                radius: magnitude*10000,
                color: 'black',
                fillColor: color,
                fillOpacity: .75,
                weight: 1
            }).bindPopup(`<h1>${properties.title}</h1> <hr> <h3>Status: ${properties.status}</h3>`)
            .addTo(myMap);
           
           

        }

    });
  
  });
  