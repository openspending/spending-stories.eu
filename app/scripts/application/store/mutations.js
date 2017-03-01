'use strict';

module.exports = {
  SET_COUNTRY: function(state, value) {
    state.countryCode = value;
  },
  SET_PERIOD: function(state, value) {
    state.period = value;
  }
};
