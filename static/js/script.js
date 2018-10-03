// need a Document Ready Function to open the modal upon
// first starting page; then can click into content
// NOTE the modal is also triggered by clicking on navbar brand

// need an onclick to map
// to display a country's name
// and that onlick pulls
// the correct country's information
// into the infobar
// it should also append the politgraph's Title, since
// that is empty when the page loads


$(".nav-tabs").on("click", "#polittab", function () {
  // on click:
  // make it Active Tab
  $(this).addClass("active");
  $("#econtab").removeClass("active");
  $("#envirotab").removeClass("active");
  // display country-appropriate polit graph
  $("#graphtitle").empty();
  $("#graphtitle").append("POLITICAL FREEDOM INDEX");
  $("#graphexplanation").empty();
  $("#graphexplanation").append("The Political Freedom Index demonstrates the freedom of citizens to express themseslves politically.");
  // display whatever links we wish to
  $("#articles").empty();
//  $("#articles").append("whatever articles we want to call in");
});

$(".nav-tabs").on("click", "#econtab", function () {
  // on click:
  // make it Active Tab
  $(this).addClass("active");
  $("#polittab").removeClass("active");
  $("#envirotab").removeClass("active");
  // display country-appropriate econ graph
  $("#graphtitle").empty();
  $("#graphtitle").append("GDP");
  $("#graphexplanation").empty();
  $("#graphexplanation").append("Gross domestic product in international dollars.");
});

$(".nav-tabs").on("click", "#envirotab", function () {
  // on click:
  // make it Active Tab
  $(this).addClass("active");
  $("#econtab").removeClass("active");
  $("#polittab").removeClass("active");
  // display country-appropriate enviro graph
  $("#graphtitle").empty();
  $("#graphtitle").append("WATER STRESS - ALL SECTORS");
  $("#graphexplanation").empty();
  $("#graphexplanation").append("“Water stress” refers to the ability, or lack thereof, to meet human and ecological demand for water. Source: WRI");
});

// Adding tile layer
  // Link to GeoJSON
  var Link = "./bounds_with_refugee_counts.geojson"
  var geojson;
  // Grab data with d3
  d3.json(Link, function(data) {
    createFeatures(data);
  });
  function createFeatures(data){
    var totalrefugees = L.choropleth(data, {
      valueProperty: "Refugees",
      scale: ["#D3D3D3", "#191970"],
      steps: 11,
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Origin Country : " + feature.properties.name + "<hr> Refugees: " + feature.properties.Refugees),
          //Function to update Country variable
          //bind click
          layer.on('click', function (e) {
            country = feature.properties.iso_a3
            update_to_selected_region(country)
          get_related_news(country_dictionary[country])
          console.log(country_dictionary[country] +"COUNTRY NAME")
          });
        }
      });

    var totalrefugeesred = L.choropleth(data, {
      valueProperty: "Refugees",
      scale: ["#D3D3D3", "red"],
      steps: 11,
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8,
      },
      
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Origin Country : " + feature.properties.name + "<hr> Refugees: " + feature.properties.Refugees),
          //Function to update Country variable
          //bind click
          layer.on('click', function (e) {
            country = feature.properties.iso_a3
            update_to_selected_region(country)
          })
        }
      })


      //}); 

    createMap(totalrefugees, totalrefugeesred)
    }






  function createMap(totalrefugees, totalrefugeesred) {
    var basemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      minZoom: 2,
      id: "mapbox.light",
      accessToken: API_KEY
    });
    var baseMaps = {
      "Base Map": basemap
    }
    var overlayMaps = {
      "Total Refugees": totalrefugees,
      "Total Refugees Red": totalrefugeesred
    }
    var myMap = L.map("map", {
        center: [40.4637, 3.7492],
        zoom: 2,
        layers: [basemap, totalrefugeesred]
      });
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = totalrefugeesred.options.limits;
    console.log(limits)
    var colors = totalrefugeesred.options.colors;
    console.log(colors)
    var labels = [];
    // Add min & max
    var legendInfo = "<h1>Refugees in America</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";
    div.innerHTML = legendInfo;
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(overlayMaps, baseMaps, {
  collapsed: false
}).addTo(myMap);

 totalrefugeesred.eachLayer(function (layer) {
   layer._path.id = layer.feature.properties.iso_a3
     })

}






//   var country = "wld"

//   // Adding tile layer
//   var basemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.light",
//     accessToken: API_KEY
//   })//.addTo(myMap);

//   // Link to GeoJSON
//   var Link = "./bounds_with_refugee_counts.geojson"

//   var geojson;

//   // Grab data with d3
//     d3.json(Link, function(data) {

//     // Create a new choropleth layer
//     geojson = L.choropleth(data, {

//       // Define what  property in the features to us

//       valueProperty: "Refugees",

// <<<<<<< databranch
// //       // Set color scale
// =======
//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("Origin Country : " + feature.properties.name + "<hr> Refugees in the US: " + feature.properties.refugee_count),
//         //Function to update Country variable
//         //bind click
//         layer.on('click', function (e) {
//           country = feature.properties.iso_a3
//           update_to_selected_region(country)
//           // get_country_name(country)
//           // console.log(country + "COUNTRY")
//           get_related_news(country_dictionary[country])
//           console.log(country_dictionary[country] +"COUNTRY NAME")
//         });
//       }
// >>>>>>> master

//       scale: ["#D3D3D3", "#191970"],

//       // Number of breaks in step range

//       steps: 11,

//       // Style
//     // This data must be passed
//     style: {
//       // Border color
//       color: "#fff",
//       weight: 1,
//       fillOpacity: 0.8
//     },


//       // Binding a pop-up to each layer
//       // Add event listener to add popup to layer and add to map

//     onEachFeature: function(feature, layer) {
//       layer.bindPopup("Origin Country : " + feature.properties.name + "<hr> Refugees: " + feature.properties.Refugees),
//         //Function to update Country variable
//         //bind click
//         layer.on('click', function (e) {
//           country = feature.properties.iso_a3
//           update_to_selected_region(country)
//         });
//       }



//   }).addTo(myMap);



//     // Set up the legend
//     var legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//       var div = L.DomUtil.create("div", "info legend");
//       var limits = geojson.options.limits;
//       console.log(limits)
//       var colors = geojson.options.colors;
//       console.log(colors)
//       var labels = [];

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(overlayMaps, {
  collapsed: true
}).addTo(myMap);

