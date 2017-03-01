'use strict';

var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      visualizations: subsidyStories.availableVisualizations
    };
  },
  methods: {
    getVisualizationUrl: function(visualization) {
      var countryCode = this.$store.state.countryCode;
      var period = this.$store.state.period;
      return subsidyStories.getVisualizationUrl(visualization,
        countryCode, period);
    }
  }
};
