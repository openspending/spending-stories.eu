'use strict';

var d3 = require('d3');

function renderMap(container, width, height) {
  // Map stroke width
  var strokeWidth = 2;

  // Define map projection

  // utiliser une projection standard pour aplatir les pôles,
  // voir D3 projection plugin
  var projection = d3.geo.mercator()
    .center([13, 57])  // comment centrer la carte, longitude, latitude
    .translate([width / 2, height / 2])  // centrer l'image obtenue dans le svg
    .scale([width / 2]); // zoom, plus la valeur est petit plus le zoom est gros

  // Define path generator
    var path = d3.geo.path()
      .projection(projection);

  // Create SVG
  var svg = d3.select(container)
    .append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  // Load in GeoJSON data
  // Bind data and create one path per GeoJSON feature
  d3.json('public/data/ne_50m_admin_0_countries_simplified.json',
    function(json) {
      svg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('stroke', 'rgba(255, 255, 255, 1)')
        .attr('stroke-width', strokeWidth)
        .attr('fill', 'rgba(0, 0, 0, 0.3)');
    });
}

module.exports = renderMap;
