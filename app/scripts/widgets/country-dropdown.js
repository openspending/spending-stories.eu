'use strict';

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  options = _.extend({
    countries: [],
    onSelectItem: _.identity
  }, options);
  container = $(container);
  _.chain(options.countries)
    .values()
    .sortBy('name')
    .each(function(country) {
      var option = $('<option>').attr('value', country.code)
        .text(country.name).appendTo(container);

      if (options.countryCode == country.code) {
        option.attr('selected', 'on');
      }
    })
    .value();
  container.on('change', function() {
    options.onSelectItem($(this).val());
  });
}

module.exports.render = render;
