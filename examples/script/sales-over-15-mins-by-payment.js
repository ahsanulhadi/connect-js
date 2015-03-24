var queryResults = require('./query-results.js').salesOver15MinsByPayment;

var fieldOptions = {
    'sellPriceTotal': {
        label: 'Sell Price',
        valueFormatter: d3.format('$,.2f')
    },
    'costPriceTotal': {
        label: 'Cost Price',
        valueFormatter: d3.format('$,.2f')
    }
}

var bar = new Connect.Viz.Chart('#sales-over-15-mins-by-payment-bar', {
    title: 'Sales Over 15 Minutes by Payment Type',
    type: 'bar',
    fieldOptions: fieldOptions,
    yAxisValueFormatter: d3.format('$,.2f')
});


var line = new Connect.Viz.Chart('#sales-over-15-mins-by-payment-line', {
    title: 'Sales Over 15 Minutes by Payment Type',
    type: 'line',
    fieldOptions: fieldOptions,
    yAxisValueFormatter: d3.format('$,.2f')
});

bar.displayData(queryResults.results, queryResults.metadata);
line.displayData(queryResults.results, queryResults.metadata);

module.exports = {
    bar: bar,
    line: line
}