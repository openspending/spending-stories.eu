'use strict';

var _ = require('lodash');
var downloader = require('./downloader');
var config = require('../../../config.json');
var countries = require('../../data/eu-countries.json');
var Promise = require('bluebird');

var defaultGeoDataUrl = 'public/data/eu-countries-polygons.json';

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
          code: country.shortCode,
          isDataAvailable: false
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
  return downloader.getJson(url)
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
          var isDataAvailable = !!_.find(codes, function(code) {
            return _.lowerCase(code) == codeToFind;
          });
          return [
            country.shortCode,
            {
              name: country.name,
              code: country[codeFormat],
              isDataAvailable: isDataAvailable
            }
          ];
        })
        .fromPairs()
        .value();
    });
}

function getGeoData(url) {
  url = url || defaultGeoDataUrl;
  return downloader.getJson(url).then(function(geoJson) {
    return _.isArray(geoJson.features) ? geoJson.features : [];
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
    return downloader.getJson(url)
      .then(processApiResponse)
      .then(function(results) {
        return isSingleResult ? _.get(results, '[0].value', 0) : results;
      });
  };
}

module.exports.getCountries = getCountries;
module.exports.getGeoData = getGeoData;
module.exports.getTotalSubsidies = createQueryFunction(
  config.queries.totalSubsidies, true);
module.exports.getTopBeneficiaries = createQueryFunction(
  config.queries.topBeneficiaries);
