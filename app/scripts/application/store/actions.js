'use strict';

var _ = require('lodash');
var subsidyStories = require('../services/subsidy-stories');

module.exports = {
  getGeoData: function() {
    return subsidyStories.getGeoData();
  },
  getCountries: function() {
    return subsidyStories.getCountries();
  },
  getTopBeneficiaries: function(store) {
    var countryCode = store.state.countryCode;
    var period = store.state.period;
    return subsidyStories.getTopBeneficiaries(countryCode, period)
      .then(function(data) {
        if (
          (countryCode != store.state.countryCode) ||
          (period != store.state.period)
        ) {
          throw new Error('Aborted.');
        }
        return data;
      });
  },
  getTotalSubsidies: function(store) {
    var countryCode = store.state.countryCode;
    var period = store.state.period;
    return subsidyStories.getTotalSubsidies(countryCode, period)
      .then(function(data) {
        if (
          (countryCode != store.state.countryCode) ||
          (period != store.state.period)
        ) {
          throw new Error('Aborted.');
        }
        return data;
      });
  },
  getCountryDescription: function(store) {
    var countryCode = store.state.countryCode;
    return subsidyStories.getCountryDescription(countryCode)
      .then(function(data) {
        if (countryCode != store.state.countryCode) {
          throw new Error('Aborted.');
        }
        return data;
      })
      .catch(function(data) {
        // Do noting
      });
  },

  setCountry: function(store, countryCode) {
    store.commit('SET_COUNTRY', countryCode);
  },
  setPeriod: function(store, period) {
    var periods = store.state.period;
    if (periods.indexOf(period) >= 0) {
      if (periods.length > 1) {
        // Do not allow to deselect last item
        store.commit('SET_PERIOD', _.difference(periods, [period]));
      }
    } else {
      store.commit('SET_PERIOD', _.union(periods, [period]));
    }
  }
};
