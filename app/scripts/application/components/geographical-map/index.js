'use strict';

var _ = require('lodash');
var $ = require('jquery');
var d3 = require('d3');
var Vuex = require('vuex');
var Promise = require('bluebird');
var subsidyStories = require('../../services/subsidy-stories');

function render(container, options) {
  if (!container) {
    return;
  }
  options = _.extend({
    data: {},
    width: 0,
    height: 0,
    getItemUrl: _.constant('javascript:void(0)'),
    countries: []
  }, options);

  var currentCountry = _.find(options.countries, {
    code: options.countryCode
  }) || {};

  // Map stroke width
  var strokeWidth = 2;

  // Calculate center of geo object, and move it a bit to left and top -
  // there is enough free space for that
  var bounds = d3.geo.bounds({
    type: 'FeatureCollection',
    features: options.data
  });

  var center = [
    - (bounds[0][0] + bounds[1][0]) / 2 - 5,
    (bounds[0][1] + bounds[1][1]) / 2 - 5
  ];

  // Remove empty space at the bottom of the map
  bounds[1][1] -= 5;

  // Define map projection
  var projection = d3.geo.mercator()
    .center(center)
    .scale(options.width);

  // Calculate map metrics and aspect ratio to set appropriate
  // dimensions for SVG container
  var pixelBounds = _.map(bounds, projection);
  pixelBounds = [
    Math.abs(pixelBounds[0][0] - pixelBounds[1][0]),
    Math.abs(pixelBounds[0][1] - pixelBounds[1][1])
  ];
  var aspectRatio = pixelBounds[1] / pixelBounds[0];

  // Offset by half of the height
  projection.translate([0, pixelBounds[1] / 2]);

  // Define path generator
  var path = d3.geo.path()
    .projection(projection);

  // Create SVG
  var svg = d3.select(container)
    .append('svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('viewBox', '0 0 ' + options.width + ' ' +
      Math.ceil(options.width * aspectRatio))
    .attr('preserveAspectRatio', 'xMinYMin meet');

  // Bind data and create one path per GeoJSON feature
  svg.selectAll('path')
    .data(options.data)
    .enter()
    .append('a')
    .attr('xlink:href', function(datum) {
      var country = _.find(options.countries, {
        iso: datum.properties.iso_a2
      });
      return _.isObject(country) ? options.getItemUrl(country.code) : null;
    })
    .filter(function(datum) {
      if (datum.properties.iso_a2 == currentCountry.iso) {
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

module.exports = {
  template: '<div></div>',
  computed: _.extend({}, Vuex.mapState([
    'countryCode'
  ])),
  methods: _.extend({}, Vuex.mapActions([
    'getGeoData',
    'getCountries'
  ])),
  mounted: function() {
    var that = this;

    Promise.all([
      that.getGeoData(),
      that.getCountries()
    ]).then(function(results) {
      var geojson = results[0];
      var countries = results[1];

      render(that.$el, {
        data: geojson,
        countryCode: that.countryCode,
        countries: _.chain(countries)
          .filter('isDataAvailable')
          .sortBy('name')
          .value(),
        width: $(window).width(),
        height: $(window).height(),
        getItemUrl: subsidyStories.getCountryPageUrl
      });
    });
  }
};
