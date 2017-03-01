'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      isLoaded: false,
      countries: []
    };
  },
  computed: Vuex.mapState({
    selected: 'countryCode'
  }),
  methods: _.extend({
    getCountryPageUrl: function(countryCode) {
      return subsidyStories.getCountryPageUrl(countryCode);
    }
  }, Vuex.mapActions([
    'getCountries'
  ])),
  created: function() {
    var that = this;
    that.getCountries().then(function(countries) {
      that.$data.countries = _.chain(countries)
        .filter('isDataAvailable')
        .sortBy('name')
        .value();
      that.$data.isLoaded = true;
    });
  }
};
