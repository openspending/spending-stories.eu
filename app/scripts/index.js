'use strict';

require('./google-fonts.js');
var $ = require('jquery');
var d3 = require('d3');
var renderMap = require('./render-map');
var services = require('./services/api');

// Init some global variables - needed for proper work of
// some 3rd-party libraries
window.jQuery = window.$ = $;
window.d3 = d3;

$(function() {
  services.getCountries().then(console.log.bind(console));
  services.getTotalSubsidies({
    countryCode: 'FI'
  }).then(console.log.bind(console));
  services.getTopBeneficiaries({
    countryCode: 'FI'
  }).then(console.log.bind(console));
  renderMap($('.hero-map').get(0), $(window).width(), $(window).height());
});

