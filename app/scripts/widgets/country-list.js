'use strict';

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  if (!container) {
    return;
  }
  options = _.extend({
    countries: [],
    getItemUrl: _.constant('javascript:void(0)')
  }, options);
  var ul = $('<ul>').addClass('list-country');
  _.chain(options.countries)
    .values()
    .sortBy('name')
    .each(function(country) {
      var url = options.getItemUrl(country.code);
      $('<li>')
        .addClass(country.code == options.countryCode ? 'selected' : '')
        .append(
          $('<a>').attr('href', url).text(country.name)
        )
        .appendTo(ul);
    })
    .value();
  $(container).append(ul);
}

module.exports.render = render;
