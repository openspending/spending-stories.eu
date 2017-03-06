'use strict';

var _ = require('lodash');
var Vue = require('vue');
var Vuex = require('vuex');
var subsidyStories = require('./services/subsidy-stories');
var components = require('./components');

_.each(['downloadDataLink', 'viewDataLink'], function(id) {
  Vue.component(id, components[id]);
});

module.exports.bootstrap = function(element) {
  return new Vue({
    el: element,
    store: require('./store'),
    components: components,
    methods: Vuex.mapActions([
      'setCountry'
    ]),
    created: function() {
      this.setCountry(subsidyStories.getCurrentCountryCode());
    }
  });
};
