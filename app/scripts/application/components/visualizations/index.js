'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      isLoaded: false,
      isAvailable: false,
      visualizations: subsidyStories.availableVisualizations
    };
  },
  computed: Vuex.mapState([
    'period',
    'countryCode'
  ]),
  watch: {
    period: function() {
      this.refresh();
    }
  },
  methods: _.extend({
    getVisualizationUrl: function(visualization) {
      return subsidyStories.getVisualizationUrl(visualization,
        this.countryCode, this.period);
    },
    refresh: function() {
      var that = this;
      that.$data.isLoaded = false;
      that.$data.isAvailable = false;
      that.getTotalSubsidies().then(function(value) {
        that.$data.isAvailable = value > 0;
        that.$data.isLoaded = true;
      });
    }
  }, Vuex.mapActions([
    'getTotalSubsidies'
  ])),
  created: function() {
    this.refresh();
  }
};
