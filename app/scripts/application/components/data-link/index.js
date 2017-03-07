'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: '<a target="_blank" v-bind:href="url"><slot></slot></a>',
  props: ['type'],
  computed: _.extend({
    url: function() {
      var countryCode = this.countryCode;
      var period = this.period;
      switch (this.type) {
        case 'download-country':
          return subsidyStories.getCSVFileUrl(countryCode, period);
          break;
        case 'view-country':
          return subsidyStories.getCountryDetailsUrl(countryCode, period);
          break;
        case 'download-all':
          return subsidyStories.getEntireCSVFileUrl();
          break;
        case 'view-all':
          return subsidyStories.getFullDatasetUrl();
          break;
      }
    }
  }, Vuex.mapState([
    'countryCode',
    'period'
  ]))
};
