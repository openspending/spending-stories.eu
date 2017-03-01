'use strict';

var Vue = require('vue');
var Vuex = require('vuex');
var subsidyStories = require('./services/subsidy-stories');

module.exports.bootstrap = function(element) {
  return new Vue({
    el: element,
    store: require('./store'),
    components: require('./components'),
    methods: Vuex.mapActions([
      'setCountry'
    ]),
    created: function() {
      this.setCountry(subsidyStories.getCurrentCountryCode());
    }
  });
};
