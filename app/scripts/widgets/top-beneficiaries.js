'use strict';

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  options = _.extend({
    items: [],
    formatValue: _.identity
  }, options);
  var ul = $('<ul>').addClass('list-unstyled list-lg');
  _.each(options.items, function(item) {
    $('<li>')
      .text(item.name + ' | ' + options.formatValue(item.value))
      .appendTo(ul);
  });
  $(container).append(ul);
}

module.exports.render = render;
