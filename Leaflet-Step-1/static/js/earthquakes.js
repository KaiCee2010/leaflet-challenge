function getColor(depth){
    return depth > 90 ? '#f03535' :
           depth > 70 ? '#f27227' :
           depth > 50 ? '#f6ac17' :
           depth > 30 ? '#f0de33' :
           depth > 10 ? '#a1f64c' :
                        '#3dc809' ;
           
}



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
            

            // if (depth > 90){
            //     var color = "#f03535"
            // }
            // else if (depth > 70){
            //     var color = "#f27227"
            // }
            // else if (depth > 50){
            //     var color = "#f6ac17"
            // }
            // else if (depth > 30){
            //     var color = "#f0de33"
            // }
            // else if (depth > 10){
            //     var color = "#a1f64c"
            // }
            // else {
            //     var color = "#3dc809"
            // }

            console.log("depth", depth)
            // console.log("color", color)


            var myCircle = L.circle([geometry.coordinates[1], geometry.coordinates[0]],{
                radius: magnitude*10000,
                color: 'black',
                fillColor: getColor(geometry.coordinates[2]),
                fillOpacity: .75,
                weight: 1
            }).bindPopup(`<h3>${properties.title}</h3> <hr> 
            <h5>Status: ${properties.status}<br>
            Earthquake Info: <a href = ${properties.url}>Detailed Earthquake Info</a><br>
            </h5> `)
            .addTo(myMap);
        }
    });

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
        depthArray = [-10, 10, 30, 50, 70, 90],
        labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depthArray.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depthArray[i] + 1) + '"></i> ' +
                depthArray[i] + (depthArray[i + 1] ? '&ndash;' + depthArray[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap)

   

    // legend.addTo(map);
  
  });
  