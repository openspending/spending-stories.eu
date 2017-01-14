'use strict';

/* global window */

var _ = require('lodash');
var $ = require('jquery');

function renderTableHeader(thead, data, options) {
  $('<tr>')
    .append($('<td>').text('title'))
    .append($('<td>').text('amount'))
    .append($('<td>').text('share'))
    .appendTo(thead);
}

function renderTableBody(tbody, data, options) {
  var names = _.extend({}, options.names);
  _.chain(data.children)
    .orderBy('value', 'desc')
    .each(function(item) {
      var itemName = names[item.key] || item.name;
      if ((itemName != '') && (item.value > 0)) {
        $('<tr>')
          .on('click', 'td', function() {
            options.onSelectItem(item.key);
          })
          .append(
            $('<td>')
              .append($('<span>').addClass('colorbox').css({
                backgroundColor: item.color
              }))
              .append($('<span>').text(itemName))
          )
          .append($('<td>').text(item.areaFmtCurrency))
          .append($('<td>').text((item.percentage * 100).toFixed(2) + '%'))
          .appendTo(tbody);
      }
    })
    .value();
}
function renderTableFooter(tfoot, data, options) {
  $('<tr>')
    .append($('<td>').text('Total'))
    .append($('<td>').text(data.summaryFmtCurrency))
    .append($('<td>').text('100%'))
    .appendTo(tfoot);
}

function render(container, options) {
  container = $(container);
  if (container.length == 0) {
    return;
  }
  // Require babbage.ui here as it is external library an is loaded after app.js
  var component = new window.Babbage.TreeMapComponent();
  component.formatValue = options.formatValue;
  component.on('click', function(component, item) {
    options.onSelectItem(item.key);
  });

  var treemapContainer = $('<div>').addClass('treemap-chart')
    .appendTo(container);

  component.on('loaded', function(component, data, root) {
    var treemapTable = $('<table>').addClass('treemap-table');

    renderTableHeader($('<thead>').appendTo(treemapTable), root, options);
    renderTableBody($('<tbody>').appendTo(treemapTable), root, options);
    renderTableFooter($('<tfoot>').appendTo(treemapTable), root, options);

    // Insert it into DOM only after building
    var tableContainer = $('<div>').addClass('treemap-list')
      .appendTo(container);
    treemapTable.appendTo(tableContainer);
  });

  component.build(options.endpoint, options.dataset, options.state,
    treemapContainer.get(0));
}

module.exports.render = render;
