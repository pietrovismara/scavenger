'use strict';

var cheerio = require('cheerio');
var _ = require('lodash');

extract.table = extractTable;
module.exports = extract;

/**
* @param {String} html
* @param {Object} options
* @param {String} options.scope - CSS selector for the elements containing data to scrape
* @param {Object} options.fields - { "fieldName": cssSelector } starts selection from scope if given
* @param {String} options.groupBy - If passed, groups results by the specified field
* @return {Object}
**/
function extract(html, options) {
    if (!_.isString(html)) {
        return html;
    }

    var $ = cheerio.load(html);
    var scope = options.scope,
        fields = options.fields,
        groupBy = options.groupBy;

    scope = scope || 'body';

    var elements = $(scope).toArray();

    var result = _.map(elements, function (elt) {
        var data = {};
        elt = $(elt);
        _.forOwn(fields, function (field, key) {
            var selector = field.selector,
                attribute = field.attribute;

            data[key] = getValue(elt.find(selector), attribute);
        });
        return data;
    });

    return groupBy ? _.groupBy(result, groupBy) : result;
}

/**
* @param {String} html
* @param {Object} options
* @param {String} options.table - CSS selector of the element containing data to scrape
* @param {Array}  options.headers - list of headers name, following the same order of table's columns
* @param {String} options.groupBy - If passed, groups results under the specified header
* @return {Object}
**/
function extractTable(html, options) {
    if (!_.isString(html)) {
        return html;
    }
    var table = options.table,
        headers = options.headers,
        groupBy = options.groupBy;

    var $ = cheerio.load(html);
    table = $(table).first();
    var rows = table.find('tbody tr');
    var tmp = [];
    rows.each(function (rowIndex) {
        var cells = $(this).find('td');
        tmp.push({});
        cells.each(function (i, elem) {
            if (!headers[i]) {
                return;
            }
            // Recursion to read all text in children
            tmp[rowIndex][headers[i]] = getValue($(this), 'text');
        });
    });

    return groupBy ? _.groupBy(tmp, groupBy) : tmp;
}

function recursiveRead(elt, $, text) {
    if (!text) {
        text = getValue(elt, 'text');
    }
    var children = elt.children();
    if (children.length) {
        children.each(function () {
            text = recursiveRead($(this), $, text + ' ');
        });
    } else {
        text += getValue(elt, 'text');
    }

    return text;
}

function getValue(elt, attribute) {
    if (attribute === 'text') {
        var result = elt.text().replace(/\t|\n/g, '').trim();
        // Leaves only one space between words
        return _.filter(result.split(''), function (char, i, text) {
            if (char === ' ') {
                return text[i + 1] !== ' ';
            }

            return true;
        }).join('');
    } else if (attribute === 'html') {
        return elt.html();
    } else {
        return elt.attr(attribute);
    }
}