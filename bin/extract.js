'use strict';

var cheerio = require('cheerio');
var _ = require('lodash');

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