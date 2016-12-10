'use strict';

var cheerio = require('cheerio');
var _ = require('lodash');

extract.table = extractTable;
module.exports = extract;

/**
* @param {String} html
* @param {Object} opts
* @param {String} opts.containers - CSS selector of the elements containing data to scrape
* @param {Object} opts.fields - { "fieldName": cssSelector } starts selection from containers
* @param {String} opts.groupBy - If passed, groups results by the specified field
* @return {Object}
**/
function extract(html, opts) {
    var $ = cheerio.load(html);
    var elements = $(opts.containers).toArray();
    var result = _.map(elements, function (elt) {
        var data = {};
        elt = $(elt);
        _.forOwn(opts.fields, function (val, key) {
            data[key] = elt.find(opts.fields[key]).clone().children().remove().end().text().replace(/\\t|\\n/g, '').trim();
        });
        return data;
    });

    return opts.groupBy ? _.groupBy(result, opts.groupBy) : result;
}

/**
* @param {String} html
* @param {Object} opts
* @param {String} opts.table - CSS selector of the element containing data to scrape
* @param {Array}  opts.headers - list of headers name, following the same order of table's columns
* @param {String} opts.groupBy - If passed, groups results under the specified header
* @return {Object}
**/
function extractTable(html, opts) {
    var $ = cheerio.load(html);
    var table = $(opts.table).first();
    var rows = table.find('tbody tr');

    var tmp = [];
    rows.each(function (rowIndex) {
        var cells = $(this).find('td');
        tmp.push({});
        cells.each(function (i, elem) {
            if (!opts.headers[i]) {
                return;
            }
            // Recursion to read all text in children
            var content = recursiveRead('', $(this), $);
            tmp[rowIndex][opts.headers[i]] = content;
        });
    });

    return opts.groupBy ? _.groupBy(tmp, opts.groupBy) : tmp;
}

function recursiveRead(text, elt, $) {
    var children = elt.children();
    if (children.length) {
        children.each(function () {
            text = recursiveRead(text, $(this), $);
        });
    } else {
        text += elt.text().replace(/\\t|\\n/g, '').trim();
    }

    return text;
}