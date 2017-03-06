'use strict';

var _ = require('lodash');
var Vuex = require('vuex');
var subsidyStories = require('../../services/subsidy-stories');

module.exports = {
  template: require('./template.html'),
  data: function() {
    return {
      isLoaded: false,
      value: 0
    };
  },
  computed: _.extend({}, Vuex.mapState([
    'period'
  ]), Vuex.mapGetters([
    'entirePeriod'
  ])),
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
      that.$data.value = 0;
      that.getTotalSubsidies().then(function(value) {
        that.$data.value = value;
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
