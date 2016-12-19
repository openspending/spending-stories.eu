'use strict';

require('./google-fonts.js');
var $ = require('jquery');
var d3 = require('d3');
var application = require('./application');

// Init some global variables - needed for proper work of
// some 3rd-party libraries
window.jQuery = window.$ = $;
window.d3 = d3;

$(function() {
  application.bootstrap();
});

