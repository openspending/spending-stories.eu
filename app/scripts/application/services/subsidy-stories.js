'use strict';

var url = require('url');
var _ = require('lodash');
var Promise = require('bluebird');
var config = require('../../../../config.json');
var utils = require('./utils');
var downloader = require('./downloader');

var defaultGeoDataUrl = 'public/data/eu.json';
var defaultCountryDescriptionUrl = 'public/data/country-descriptions';

var availablePeriods = ['2007-2013', '2014-2020'];

var visualizationIds = {
  'treemap': 'Treemap',
  'piechart': 'PieChart',
  'bubbletree': 'BubbleTree',
  'sankey': 'Sankey',
  'barchart': 'BarChart',
  'table': 'Table',
  'radar': 'Radar',
  'linechart': 'LineChart',
  'map': 'Map',
  'pivottable': 'PivotTable'
};

function mergePeriods(periods) {
  var years = [];
  _.each(periods, function(period) {
    years = _.union(years, period.split('-'));
  });
  return [_.min(years), _.max(years)].join('-');
}

function prepareQueryString(query) {
  var result = [];
  _.each(query, function(value, key) {
    key = encodeURIComponent(key);
    if (_.isArray(value)) {
      _.each(value, function(v) {
        result.push(key + '=' + encodeURIComponent(v));
      });
    } else {
      result.push(key + '=' + encodeURIComponent(value));
    }
  });

  return result.join('&');
}

function prepareAPIQueryParams(countryCode, periods) {
  var query = {
    cut: []
  };
  if (_.isString(countryCode) && (countryCode != '')) {
    query.cut.push(config.api.countryCodeDimension + ':' +
      JSON.stringify(countryCode));
  }
  if (_.isArray(periods) && (periods.length > 0)) {
    if (periods.length != availablePeriods.length) {
      query.cut.push(
        config.api.periodDimension + ':' +
        _.chain(periods)
          .map(JSON.stringify)
          .join(';')
          .value()
      );
    }
  }
  query.cut = query.cut.join('|');

  return query;
}

function prepareOSViewerQueryParams(countryCode, periods, visualizationType) {
  var query = {
    'measure': config.api.measure,
    'groups[]': config.api.dimension,
    'order': config.api.measure + '|desc'
  };

  if (_.isString(countryCode) && (countryCode != '')) {
    query['filters[' + config.api.countryCodeDimension + '][]'] =
      JSON.stringify(countryCode);
  }

  if (_.isArray(periods) && (periods.length > 0)) {
    if (periods.length != availablePeriods.length) {
      query['filters[' + config.api.periodDimension + '][]'] =
        _.map(periods, JSON.stringify);
    }
  }

  var visualizationId = visualizationIds[visualizationType];
  if (visualizationId) {
    query['visualizations[]'] = visualizationId;
  }

  return query;
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

function getCountryCodeFromUrl(value) {
  var parts = url.parse(value, true);
  if (_.isObject(parts)) {
    if (_.isObject(parts.query)) {
      return parts.query.country || '';
    }
  }
  return '';
}

function getCurrentCountryCode() {
  return getCountryCodeFromUrl(window.location.href);
}

function getCountryPageUrl(countryCode) {
  if (!_.isString(countryCode) || (countryCode == '')) {
    return '/';
  }
  return '/country.html?country=' + encodeURIComponent(countryCode);
}

function navigateToCountryPage(countryCode) {
  window.location.href = getCountryPageUrl(countryCode);
}

function getCSVFileUrl(countryCode, periods) {
  periods = availablePeriods;
  var period = mergePeriods(periods);
  countryCode = _.lowerCase(countryCode);
  return [
    config.api.datastore,
    '/' + config.api.dataset.split(':')[0],  // owner ID
    '/' + countryCode + '-eu-esif-funds-beneficiaries-2000-2020-full',
    '/data',
    '/' + countryCode + '-eu-esif-funds-beneficiaries-' + period + '-full.csv'
  ].join('');
}

function getEntireCSVFileUrl() {
  var period = mergePeriods(availablePeriods);
  return [
    config.api.datastore,
    '/' + config.api.dataset.split(':')[0],  // owner ID
    '/' + config.api.dataset.split(':')[1],  // dataset ID
    '/data',
    '/eu-esif-funds-beneficiaries-' + period + '-full.csv'
  ].join('');
}

function getCountryDetailsUrl(countryCode, periods) {
  var query = prepareOSViewerQueryParams(countryCode, periods, 'treemap');
  countryCode = _.lowerCase(countryCode);

  return [
    config.osViewerUrl,
    '/' + config.api.dataset.split(':')[0],  // owner ID
    ':' + countryCode + '-eu-esif-funds-beneficiaries-2000-2020-full',
    '?' + prepareQueryString(query)
  ].join('');
}

function getFullDatasetUrl() {
  return [
    config.osViewerUrl,
    '/' + config.api.dataset
  ].join('');
}

function getCountryDescription(countryCode) {
  return downloader.get([
    defaultCountryDescriptionUrl,
    '/' + countryCode + '.html'
  ].join(''));
}

function getVisualizationUrl(visualization, countryCode, periods) {
  var query = _.extend(
    prepareOSViewerQueryParams(countryCode, periods, visualization.type),
    visualization.query
  );

  return [
    config.osViewerUrl,
    '/embed/' + visualization.type,
    '/' + config.api.dataset,
    '?' + prepareQueryString(query)
  ].join('');
}

function getCountries() {
  var result = _.chain(config.countries)
    .map(function(country) {
      return [
        country.code,
        _.extend({}, country, {
          isDataAvailable: false
        })
      ];
    })
    .fromPairs()
    .value();

  if (!config.api.countryCodeDimension) {
    return Promise.resolve(result);
  }
  var url = config.api.endpoint +
    '/cubes/' + encodeURIComponent(config.api.dataset) +
    '/members/' + encodeURIComponent(config.api.countryCodeDimension);
  return downloader.getJson(url)
    .then(function(response) {
      var key = config.api.countryCodeDimension;
      _.chain(response.data)
        .map(function(item) {
          return item[key];
        })
        .filter()
        .each(function(code) {
          if (code in result) {
            result[code].isDataAvailable = true;
          }
        })
        .values()
        .value();
      return result;
    });
}

function getGeoData(url) {
  url = url || defaultGeoDataUrl;
  return downloader.getJson(url).then(function(geoJson) {
    return _.isArray(geoJson.features) ? geoJson.features : [];
  });
}

function getTotalSubsidies(countryCode, periods) {
  var query = _.extend(
    prepareAPIQueryParams(countryCode, periods),
    {
      aggregates: config.api.measure,
      drilldown: config.api.totalSubsidiesDimension
    }
  );

  var url = config.api.endpoint +
    '/cubes/' + encodeURIComponent(config.api.dataset) +
    '/aggregate?' + prepareQueryString(query);
  return downloader.getJson(url)
    .then(processApiResponse)
    .then(function(results) {
      return _.reduce(results, function(accumulator, item) {
        return accumulator + item.value;
      }, 0);
    });
}

function getTopBeneficiaries(countryCode, periods) {
  var query = _.extend(
    prepareAPIQueryParams(countryCode, periods),
    {
      aggregates: config.api.measure,
      drilldown: config.api.topBeneficiariesDimension,
      order: config.api.measure + ':desc',
      pagesize: 10
    }
  );

  var url = config.api.endpoint +
    '/cubes/' + encodeURIComponent(config.api.dataset) +
    '/aggregate?' + prepareQueryString(query);
  return downloader.getJson(url).then(processApiResponse);
}

module.exports.availableVisualizations = config.visualizations;
module.exports.availablePeriods = availablePeriods;
module.exports.mergePeriods = mergePeriods;

module.exports.getCountryPageUrl = getCountryPageUrl;
module.exports.navigateToCountryPage = navigateToCountryPage;
module.exports.getVisualizationUrl = getVisualizationUrl;
module.exports.getCountryCodeFromUrl = getCountryCodeFromUrl;
module.exports.getCurrentCountryCode = getCurrentCountryCode;
module.exports.getCSVFileUrl = getCSVFileUrl;
module.exports.getEntireCSVFileUrl = getEntireCSVFileUrl;
module.exports.getCountryDetailsUrl = getCountryDetailsUrl;
module.exports.getFullDatasetUrl = getFullDatasetUrl;
module.exports.getCountryDescription = getCountryDescription;

module.exports.getCountries = getCountries;
module.exports.getGeoData = getGeoData;
module.exports.getTotalSubsidies = getTotalSubsidies;
module.exports.getTopBeneficiaries = getTopBeneficiaries;

module.exports.formatValue = utils.formatValue(config.valueFormattingScale);
