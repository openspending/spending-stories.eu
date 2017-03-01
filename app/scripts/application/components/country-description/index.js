'use strict';

var Vuex = require('vuex');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      isLoaded: false,
      description: ''
    };
  },
  methods: Vuex.mapActions([
    'getCountryDescription'
  ]),
  created: function() {
    var that = this;
    that.getCountryDescription().then(function(description) {
      that.$data.description = description;
      that.$data.isLoaded = true;
    });
  }
};
