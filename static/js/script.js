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
    console.log(data);
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
            console.log(typeof(e));
            country = feature.properties.iso_a3;
            update_to_selected_region(country);
            get_related_news(country_dictionary[country]);
            console.log(country);
            d3.json(`/refugees_origin_destination/${country}`, function(json) {
                console.log("newdata", json[country]);
                // console.log("Percentage", json[country].keys()['Percentage']);
                d3.selectAll('path.leaflet-interactive')
                  .style('fill', 'gray');
                d3.select('#' + country)
                  .style('fill', 'red');
                  // .style('fill', 'green');
                // console.log("AYUDAME: ", json[country]['AUS']['Percentage'])
                for (keys in json[country]) {
                  console.log("KEY: ", keys);
                  console.log("Percentage AYUDAME: ", json[country][keys]['Percentage'])
                  d3.select("#" + keys)
                    .style('fill', '#191970')
                    .style('fill-opacity', (((json[country][keys]['Percentage'])+0.1)*2));
                  }
                });

//             d3.json(`/refugees_over_time/${country}`, function(response) {
//               console.log("Over Time", response);
//               var chart_title = d3.select("#overtime")
//               chart_title.selectAll("text").remove();
//               country_name = update_to_selected_region(country);
//               chart_title.append("text").text(`Refugees from ${country_name} Over Time` );
//
//               d3.select("#overtime_2")
//               var svgWidth = 700;
//               var svgHeight = 300;
//
// // Define the chart's margins as an object
//               var margin = {
//                 top: 10,
//                 right: 30,
//                 bottom: 10,
//                 left: 30
//               };
//
// // Define dimensions of the chart area
//               var chartWidth = svgWidth - margin.left - margin.right;
//               var chartHeight = svgHeight - margin.top - margin.bottom;
//
// // Select body, append SVG area to it, and set its dimensions
//               var linechart_svg = d3.select("#overtime_2")
//                 .append("svg")
//                   .attr("width", chartWidth)
//                   .attr("height", chartHeight)
//                 .append("g")
//                   .attr("transform", `translate(${margin.left}, ${margin.top})`);
//
//               var xLinearScale = d3.scaleLinear()
//                 .domain([0,10])
//                 .range([0, chartWidth]);
//
//   // Configure a linear scale with a range between the chartHeight and 0
//               var yLinearScale = d3.scaleLinear()
//                 .domain([0, 10])
//                 .range([chartHeight, 0]);
//
//               var bottomAxis = d3.axisBottom(xLinearScale);
//               var leftAxis = d3.axisLeft(yLinearScale);
//
//               linechart_svg.append("g")
//                 .classed("axis", true)
//                 .call(leftAxis);
//
//                 // Append an SVG group element to the chartGroup, create the bottom axis inside of it
//                 // Translate the bottom axis to the bottom of the page
//               linechart_svg.append("g")
//                 .classed("axis", true)
//                 .attr("transform", `translate(0, ${chartHeight})`)
//                 .call(bottomAxis);
//             });
              // country.id.background-color: 'red'
              //   for (keys() in json):
              //     key.id.background_color: 'purple'
              //   //all countries set to gray
                // country set to red
                // for all keys in newdata
                // set country to purple

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
<<<<<<< HEAD
      minZoom: 2,
=======
      minZoom: 1,
>>>>>>> Brian
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
        layers: [basemap, destinations]
      });

  var legendTotalRefugees = L.control({ position: "bottomright" });
  legendTotalRefugees.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = totalrefugees.options.limits;
    console.log(limits)
    var colors = totalrefugees.options.colors;
    console.log(colors)
    var labels = [];
    // Add min & max
    var legendInfo = "<h1>Total Refugees</h1>" +
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

  var legendDestinations = L.control({ position: "bottomright" });
  legendDestinations.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ['Low','Some', 'Bit More', 'Still Goin', 'Almost', 'Noiiiice','Yowza', 'Reception','High'];
    console.log(limits);
    colors_list = ['#D3D3D3', '#BBBBC6', '#A4A4BA', '#8D8DAD', '#7676A1', '#5E5E95', '#474788', '#30307C', '#191970'];
    var colors = colors_list;
    console.log(colors);
    var labels = [];
    // Add min & max
    var legendInfo = "<h1>Hosted Refugees</h1>" +
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

  legendDestinations.addTo(myMap);

  myMap.on('baselayerchange', function (eventLayer) {
    console.log("layer_change!  ", eventLayer.name)
    if (eventLayer.name == 'Total Refugees') {
        this.removeControl(legendDestinations);
        legendTotalRefugees.addTo(this);
    } else { // Or switch to the Population Change legend...
        this.removeControl(legendTotalRefugees);
        legendDestinations.addTo(this);
    }
  });
  // Adding legend to the map
  // legend.addTo(myMap);
// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(overlayMaps, baseMaps, {
  collapsed: false
}).addTo(myMap);

<<<<<<< HEAD
 totalrefugees.eachLayer(function (layer) {
   layer._path.class = layer.feature.properties.iso_a3
=======
 destinations.eachLayer(function (layer) {
   layer._path.id = layer.feature.properties.iso_a3
>>>>>>> Brian
     })

 totalrefugees.eachLayer(function (layer) {
    layer._path.id = layer.feature.properties.iso_a3
    })


}




