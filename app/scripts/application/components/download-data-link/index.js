'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: '<a target="_blank" v-bind:href="url"><slot></slot></a>',
  computed: _.extend({
    url: function() {
      return subsidyStories.getCSVFileUrl(this.countryCode, this.period);
    }
  }, Vuex.mapState([
    'countryCode',
    'period'
  ]))
};
