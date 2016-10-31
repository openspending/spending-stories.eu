$(document).ready(function () {

//Width and height
  var w = $(window).width();
  var h = $(window).height();


// Map stroke width
  var strokeWidth = 2;
  var baseCountryColor = '#b2b2b2';
  var activeCountryColor = '#94ADD6';
  var strokeCountryColor = '#ffffff';

//Define map projection
  var projection = d3.geo.mercator() //utiliser une projection standard pour aplatir les pôles, voir D3 projection plugin
          .center([13, 57]) //comment centrer la carte, longitude, latitude
          .translate([w / 2, h / 2]) // centrer l'image obtenue dans le svg
          .scale([w / 2]); // zoom, plus la valeur est petit plus le zoom est gros

//Define path generator
  var path = d3.geo.path()
          .projection(projection);

//Create SVG
  var svg = d3.select(".hero-map")
          .append("svg")
          .attr("viewBox", "0 0 " + w + " " + h)
          .attr("preserveAspectRatio", "xMinYMin meet");

//Load in GeoJSON data
  d3.json("app/scripts/europe.json", function (json) {

    //Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", strokeCountryColor)
            .attr("stroke-width", strokeWidth)
            .attr("fill", baseCountryColor)
            .on("click", function () {
              svg.selectAll("path").attr("class", "");
              d3.select(this).attr("class", "selected");
            });

  });

});