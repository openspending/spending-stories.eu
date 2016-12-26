'use strict';

/* global window */

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  options = _.extend({
    countries: [],
    baseUrl: ''
  }, options);
  container = $(container);
  _.each(options.countries, function(country) {
    $('<option>').attr('value', country.code)
      .text(country.name).appendTo(container);
  });
  container.on('change', function() {
    var code = $(this).val();
    var url = options.baseUrl + '?country=' + encodeURIComponent(code);
    window.location.href = url;
  });
}

module.exports.render = render;
