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

  // Define map projection
  var projection = d3.geo.mercator()
    .center([-10, 55])
    .translate([0, options.height])
    .scale([options.width]);

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
