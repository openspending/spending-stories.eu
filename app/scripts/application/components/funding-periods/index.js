'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      items: subsidyStories.availablePeriods
    };
  },
  computed: Vuex.mapState({
    selected: 'period'
  }),
  methods: _.extend({
    isSelected: function(period) {
      return this.selected.indexOf(period) >= 0;
    }
  }, Vuex.mapActions([
    'setPeriod'
  ]))
};
