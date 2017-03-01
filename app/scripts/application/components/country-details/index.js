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
  computed: _.extend({
    countryName: function() {
      var country = _.find(this.$data.countries, {
        code: this.countryCode
      });
      return country ? country.name : 'N/A';
    },
    dataFileUrl: function() {
      return subsidyStories.getCSVFileUrl(this.countryCode, this.period);
    },
    detailsUrl: function() {
      return subsidyStories.getCountryDetailsUrl(this.countryCode, this.period);
    }
  }, Vuex.mapState([
    'countryCode',
    'period'
  ])),
  methods: Vuex.mapActions([
    'getCountries'
  ]),
  created: function() {
    var that = this;
    that.getCountries().then(function(countries) {
      that.$data.countries = countries;
      that.$data.isLoaded = true;
    });
  }
};
