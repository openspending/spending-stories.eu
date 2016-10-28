'use strict';

require('js-polyfills/xhr');
require('isomorphic-fetch');

var _ = require('lodash');

// Init some global variables - needed for proper work of angular and
// some other 3rd-party libraries
(function(globals) {
  globals._ = _;

  require('./google-fonts.js');
  
  var jquery = require('jquery');
  var d3 = require('./d3.v3.min.js');

  globals.jQuery = globals.$ = jquery;
  globals.d3 = d3;

  require('./topojson.v1.min.js');
  require('./d3-map-europe.js');

  // fetch() polyfill
  require('isomorphic-fetch/fetch-npm-browserify');

  require('os-bootstrap/dist/js/os-bootstrap');

  var angular = require('angular');
  globals.angular = angular;
  if (typeof globals.Promise != 'function') {
    globals.Promise = require('bluebird');
  }

  globals.addEventListener('load', function() {
    require('./application');
    angular.bootstrap(globals.document, ['Application']);
  });
})(window || this);
