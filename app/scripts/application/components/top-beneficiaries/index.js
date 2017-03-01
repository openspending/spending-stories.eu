'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      isLoaded: false,
      items: []
    };
  },
  computed: Vuex.mapState([
    'period'
  ]),
  watch: {
    period: function() {
      this.refresh();
    }
  },
  methods: _.extend({
    formatValue: subsidyStories.formatValue,
    refresh: function() {
      var that = this;
      that.$data.isLoaded = false;
      that.$data.items = [];
      that.getTopBeneficiaries().then(function(items) {
        that.$data.items = items;
        that.$data.isLoaded = true;
      });
    }
  }, Vuex.mapActions([
    'getTopBeneficiaries'
  ])),
  created: function() {
    this.refresh();
  }
};
