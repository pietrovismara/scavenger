const cheerio = require('cheerio');
const _ = require('lodash');

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

    const $ = cheerio.load(html);
    let {scope, fields, groupBy} = options;
    scope = scope || 'body';
    const elements = $(scope).toArray();
    const result = _.map(elements, (elt) => {
        const data = {};
        elt = $(elt);
        _.forOwn(fields, (field, key) => {
            const {selector, attribute} = field;
            data[key] = getValue(elt.find(selector), attribute);
        });
        return data;
    });


    return groupBy ? _.groupBy(result, groupBy) : result;
}

function getValue(elt, attribute) {
    if (attribute === 'text') {
        const result = elt.text().replace(/\t|\n/g, '').trim();
        // Leaves only one space between words
        return _.filter(result.split(''), (char, i, text) => {
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
