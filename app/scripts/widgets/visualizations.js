'use strict';

var _ = require('lodash');
var $ = require('jquery');

function render(container, options) {
  container = $(container);
  options = _.extend({
    items: []
  }, options);

  _.each(options.items, function(url) {
    var wrapper = $('<div>')
      .css({
        position: 'relative',
        minHeight: '250vh'
      })
      .append(
        $('<iframe>')
          .attr({
            width: '100%',
            height: '100%',
            border: '0',
            frameborder: '0',
            seamless: 'on',
            src: url
          })
          .css({
            border: 0,
            margin: 0,
            padding: 0,
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%'
          })
      );

    $('<div>').addClass('content-grid-item')
      .append(wrapper).appendTo(container);
  });
}

module.exports.render = render;
