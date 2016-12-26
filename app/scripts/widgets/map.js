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
    baseUrl: '',
    countries: null
  }, options);

  // Map stroke width
  var strokeWidth = 2;

  // Define map projection
  var projection = d3.geo.mercator()
    .center([-10, 55])
    .translate([options.width / 2, options.height / 2])
    .scale([options.width / 2]);

  // Define path generator
  var path = d3.geo.path()
    .projection(projection);

  // Create SVG
  var svg = d3.select(container)
    .append('svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', '0 0 ' + options.width + ' ' + options.height)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  // Bind data and create one path per GeoJSON feature
  svg.selectAll('path')
    .data(options.data)
    .enter()
    .append('a')
    .attr('xlink:href', function(datum) {
      var code = datum.properties.iso_a2;
      var url = options.baseUrl + '?country=' + encodeURIComponent(code);
      var country = _.get(options, 'countries.' + code);
      return _.isObject(country) ? url : null;
    })
    .filter(function(datum) {
      if (datum.properties.iso_a2 == options.countryCode) {
        $(this).addClass('active-country');
      }
      return this;
    })
    .filter(function() {
      if (!$(this).attr('href'))
        $(this).addClass('inactive-country');
      return this;
    })
    .append('path')
    .attr('d', path)
    .attr('stroke', 'rgba(255, 255, 255, 1)')
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'rgba(0, 0, 0, 0.3)');
}

module.exports.render = render;
