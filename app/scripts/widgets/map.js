'use strict';

var _ = require('lodash');
var $ = require('jquery');
var d3 = require('d3');

function render(container, options) {
  container = $(container).get(0);
  options = _.extend({
    data: {},
    width: 0,
    height: 0,
    baseUrl: ''
  }, options);

  // Map stroke width
  var strokeWidth = 2;

  // Define map projection
  var projection = d3.geo.mercator()
    .center([13, 57])
    .translate([options.width / 2, options.height / 2])
    .scale([options.width / 2]);

  // Define path generator
  var path = d3.geo.path()
    .projection(projection);

  // Create SVG
  var svg = d3.select(container)
    .append('svg')
    .attr('viewBox', '0 0 ' + options.width + ' ' + options.height)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  // Bind data and create one path per GeoJSON feature
  svg.selectAll('path')
    .data(options.data)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('stroke', 'rgba(255, 255, 255, 1)')
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'rgba(0, 0, 0, 0.3)');
}

module.exports.render = render;
