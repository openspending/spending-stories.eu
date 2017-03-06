'use strict';

var subsidyStories = require('../services/subsidy-stories');

module.exports = {
  entirePeriod: function(state) {
    return subsidyStories.mergePeriods(state.period);
  }
};
