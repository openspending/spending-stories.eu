'use strict';

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  options = _.extend({
    items: [],
    formatValue: _.identity
  }, options);
  var ul = $('<ul>').addClass('list-unstyled list-md');
  _.each(options.items, function(item) {
    $('<li>')
      .addClass('beneficiary')
      .html(
        '<div class="row"><div class="col-xs-8">' + item.name +
        '</div><div class="col-xs-4 total-budget">' +
        options.formatValue(item.value) + '</div></div>')
      .appendTo(ul);
  });
  $(container).append(ul);
}

module.exports.render = render;
