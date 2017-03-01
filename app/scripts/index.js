'use strict';

var $ = require('jquery');
var d3 = require('d3');
var application = require('./application');

// Init some global variables - needed for proper work of
// some 3rd-party libraries
window.jQuery = window.$ = $;
window.d3 = d3;
//require('os-bootstrap/dist/js/os-bootstrap');
require('os-bootstrap/js/modal');

$(function() {
  application.bootstrap('#application');
});

