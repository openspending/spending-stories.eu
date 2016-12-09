'use strict';

require('./google-fonts.js');
var $ = require('jquery');
var d3 = require('d3');
var renderMap = require('./render-map');

// Init some global variables - needed for proper work of
// some 3rd-party libraries
window.jQuery = window.$ = $;
window.d3 = d3;

$(function() {
  renderMap($('.hero-map').get(0), $(window).width(), $(window).height());
});

