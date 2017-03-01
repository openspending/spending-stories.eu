'use strict';

var subsidyStories = require('../services/subsidy-stories');

module.exports = {
  countryCode: '',
  // Entire period is selected by default
  period: subsidyStories.availablePeriods
};
