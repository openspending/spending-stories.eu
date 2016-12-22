'use strict';

var _ = require('lodash');

function formatValue(scale) {
  if (_.isString(scale)) {
    try {
      scale = JSON.parse('{' + scale + '}');
    } catch (e) {
      console.warn('Cannot parse formatting scale: ' + JSON.stringify(scale));
      scale = null;
    }
  }
  if (!_.isObject(scale)) {
    scale = {
      Billions: 1000000000,
      Millions: 1000000,
      Thousands: 1000
    };
  }

  var suffixes = _.chain(scale)
    .map(function(value, key) {
      value = parseInt(value) || 0;
      if (value > 0) {
        return [value, _.trim(key)];
      }
      return null;
    })
    .filter()
    .sortBy(function(item) {
      return item[0];
    })
    .reverse()
    .value();

  return function(value) {
    var num = parseFloat(value);
    if (!isFinite(num)) {
      return value;
    }
    value = num;

    var suffix = '';
    for (var i = 0; i < suffixes.length; i++) {
      if (value > suffixes[i][0]) {
        value = value / suffixes[i][0];
        suffix = suffixes[i][1];
        break;
      }
    }

    value = (1.0 * value || 0.0).toFixed(2);
    value = value.replace(/0+$/g, '').replace(/\.$/g, '.0');
    return value + (suffix != '' ? ' ' + suffix : '');
  };
}

module.exports.formatValue = formatValue;
