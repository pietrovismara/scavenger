const url = require('url');
const request = require('request-promise');
const debug = require('debug')('scavenger:util');

// Normalizes unimportant differences in URLs - e.g. ensures
// http://google.com/ and http://google.com normalize to the same string
module.exports.normalizeUrl = function(u) {
    return url.format(url.parse(u, true));
};

// Gets the URL to prerender from a request, stripping out unnecessary parts
module.exports.getUrl = function(req) {
    var decodedUrl, realUrl = req.url,
        parts;

    realUrl = realUrl.replace(/^\//, '');

    try {
        decodedUrl = decodeURIComponent(realUrl);
    } catch (e) {
        decodedUrl = realUrl;
    }

    //encode a # for a non #! URL so that we access it correctly
    decodedUrl = this.encodeHash(decodedUrl);

    //if decoded url has two query params from a decoded escaped fragment for hashbang URLs
    if (decodedUrl.indexOf('?') !== decodedUrl.lastIndexOf('?')) {
        decodedUrl = decodedUrl.substr(0, decodedUrl.lastIndexOf('?')) + '&' + decodedUrl.substr(decodedUrl.lastIndexOf('?') + 1);
    }

    parts = url.parse(decodedUrl, true);

    // Remove the _escaped_fragment_ query parameter
    if (parts.query && parts.query.hasOwnProperty('_escaped_fragment_')) {

        if (parts.query['_escaped_fragment_'] && !Array.isArray(parts.query['_escaped_fragment_'])) {
            parts.hash = '#!' + parts.query['_escaped_fragment_'];
        }

        delete parts.query['_escaped_fragment_'];
        delete parts.search;
    }

    // Bing was seen accessing a URL like /?&_escaped_fragment_=
    delete parts.query[''];

    var newUrl = url.format(parts);

    //url.format encodes spaces but not arabic characters. decode it here so we can encode it all correctly later
    try {
        newUrl = decodeURIComponent(newUrl);
    } catch (e) {}

    newUrl = this.encodeHash(newUrl);

    return newUrl;
};

module.exports.encodeHash = function(url) {
    if (url.indexOf('#!') === -1 && url.indexOf('#') >= 0) {
        url = url.replace(/#/g, '%23');
    }

    return url;
};

module.exports.cleanFilename = function(filename) {
    filename = filename.replace(/\/\//g, '_');
    filename = filename.replace(/\//g, '_');
    filename = filename.replace(/\:/g, '');
    filename = filename.replace(/\./g, '');
    return filename;
};

module.exports.removeScriptTags = function(documentHTML) {
    var matches = documentHTML.toString().match(/<script(?:.*?)>(?:[\S\s]*?)<\/script>/gi);
    matches.forEach((match, i, matchesList) => {
        if (match.indexOf('application/ld+json') === -1) {
            documentHTML = documentHTML.toString().replace(match, '');
        }
    });

    return documentHTML;
};

module.exports.setHttpHeaders = function(documentHTML) {
    var statusMatch = /<meta[^<>]*(?:name=['"]prerender-status-code['"][^<>]*content=['"]([0-9]{3})['"]|content=['"]([0-9]{3})['"][^<>]*name=['"]prerender-status-code['"])[^<>]*>/i;
    var headerMatch = /<meta[^<>]*(?:name=['"]prerender-header['"][^<>]*content=['"]([^'"]*?): ?([^'"]*?)['"]|content=['"]([^'"]*?): ?([^'"]*?)['"][^<>]*name=['"]prerender-header['"])[^<>]*>/gi;

    var head = documentHTML.toString().split('</head>', 1).pop(),
        statusCode = 200,
        match,
        headerKey,
        headerVal;

    if (match = statusMatch.exec(head)) {
        statusCode = match[1] || match[2];
        documentHTML = documentHTML.toString().replace(match[0], '');
    }

    while (match = headerMatch.exec(head)) {
        headerKey = match[1] || match[3];
        headerVal = match[2] || match[4];
        documentHTML = documentHTML.toString().replace(match[0], '');
    }

    return {
        headerKey: headerKey,
        headerVal: headerVal,
        statusCode: statusCode,
        documentHTML: documentHTML
    };
};

module.exports.isJPEG = function(str) {
    if (!str || typeof str !== 'string') {
        return false;
    }
    let format = str.toLowerCase();
    return format === 'jpeg' || format === 'jpg';
}
