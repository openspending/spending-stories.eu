'use strict';

var _ = require('lodash');
var config = require('../../../config.json');
var countries = require('../../data/eu-countries.json');
var Promise = require('bluebird');

function processFetchResponse(response) {
  if (response.status != 200) {
    throw new Error('Failed loading data from ' + response.url);
  }
  return response.text();
}

function processApiResponse(response) {
  var key = _.first(response.attributes);
  var value = _.first(response.aggregates);
  return _.map(response.cells, function(cell) {
    return {
      name: cell[key],
      value: cell[value]
    };
  });
}

function getCountries() {
  var emptyResponse = _.chain(countries)
    .map(function(country) {
      return [
        country.shortCode,
        {
          name: country.name,
          code: null
        }
      ];
    })
    .fromPairs()
    .value();

  if (!config.countryCodeDimension) {
    return Promise.resolve(emptyResponse);
  }
  var url = config.endpoint + '/cubes/' + encodeURIComponent(config.dataset) +
    '/members/' + encodeURIComponent(config.countryCodeDimension);
  return fetch(url)
    .then(processFetchResponse)
    .then(JSON.parse)
    .then(function(response) {
      var key = config.countryCodeDimension;
      var codes = _.chain(response.data)
        .map(function(item) {
          return item[key];
        })
        .filter()
        .value();
      if (codes.length == 0) {
        return emptyResponse;
      }
      var codeFormat = codes[0].length == 2 ? 'shortCode' : 'longCode';
      return _.chain(countries)
        .map(function(country) {
          var codeToFind = _.lowerCase(country[codeFormat]);
          var code = _.find(codes, function(code) {
            return _.lowerCase(code) == codeToFind;
          });
          return [
            country.shortCode,
            {
              name: country.name,
              code: code || null
            }
          ];
        })
        .fromPairs()
        .value();
    });
}

function createQueryFunction(params, isSingleResult) {
  return function(options) {
    options = _.extend({}, options);
    var additionalParams = {};
    if (config.countryCodeDimension && options.countryCode) {
      additionalParams.cut = {};
      additionalParams.cut[config.countryCodeDimension] = options.countryCode;
    }

    var query = _.chain({})
      .merge(params, additionalParams)
      .map(function(value, name) {
        if (_.isObject(value)) {
          value = _.chain(value)
            .map(function(value, key) {
              return key + ':' + JSON.stringify(value);
            })
            .join('|')
            .value();
        }
        return encodeURIComponent(name) + '=' + encodeURIComponent(value);
      })
      .join('&')
      .value();
    var url = config.endpoint + '/cubes/' + encodeURIComponent(config.dataset) +
      '/aggregate?' + query;
    return fetch(url)
      .then(processFetchResponse)
      .then(JSON.parse)
      .then(processApiResponse)
      .then(function(results) {
        return isSingleResult ? _.get(results, '[0].value', 0) : results;
      });
  };
}

module.exports.getCountries = getCountries;
module.exports.getTotalSubsidies = createQueryFunction(
  config.queries.totalSubsidies, true);
module.exports.getTopBeneficiaries = createQueryFunction(
  config.queries.topBeneficiaries);
