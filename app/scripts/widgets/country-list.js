'use strict';

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  options = _.extend({
    countries: [],
    baseUrl: ''
  }, options);
  var ul = $('<ul>').addClass('list-country');
  _.each(options.countries, function(country) {
    var url = options.baseUrl + '?country=' + encodeURIComponent(country.code);
    $('<li>')
      .append(
        $('<a>').attr('href', url).text(country.name)
      )
      .appendTo(ul);
  });
  $(container).append(ul);
}

module.exports.render = render;
