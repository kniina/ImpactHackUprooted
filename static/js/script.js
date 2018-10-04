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
  var Link = "static/bounds_with_refugee_counts.geojson"
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
          });
        }
      });

    var destinations = L.choropleth(data, {
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
            console.log(country);
            d3.json(`/refugees_origin_destination/${country}`, function(json) {
                console.log("newdata", json);
            });
          })
        }
      })


      //});

    createMap(totalrefugees, destinations)
    }






  function createMap(totalrefugees, destinations) {
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
      "Refugee Destinations": destinations
    }
    var myMap = L.map("map", {
        center: [40.4637, 3.7492],
        zoom: 2,
        layers: [basemap, totalrefugees]
      });
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = totalrefugees.options.limits;
    console.log(limits)
    var colors = totalrefugees.options.colors;
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

 totalrefugees.eachLayer(function (layer) {
   layer._path.class = layer.feature.properties.iso_a3
     })

}




