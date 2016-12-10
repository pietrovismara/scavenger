"use strict";

const _ = require('lodash');
const minifier = require('html-minifier').minify;
const debug = require('debug')('scavenger:scavenger');
const webdriver = require(`./webdriver`);
const imager = require(`./imager`);
const util = require(`./util`);
const extr = require(`./extract`);

let scavenger = {
    load: load,
    scrape: scrape,
    screenshot: screenshot,
    extract: extract,
    end: end
};

module.exports = scavenger;

function end() {
    return webdriver.end();
}

async function load(options) {
    let {url, selector} = parseOptions(options);
    try {
        if (!url) {
            throw new Error('Missing URL');
        }

        await webdriver.load(url);
        if (selector) {
            await webdriver.waitForElement(selector);
        }
    } catch (e) {
        return Promise.reject(e);
    }
}

async function scrape(options) {
    debug('scrape');
    let html, autoEnd, {minify, evaluate} = parseOptions(options);
    try {
        if (!await webdriver.isLoaded()) {
            autoEnd = true;
            await load(options);
        }
        html = await webdriver.getHTML(evaluate);
    } catch (e) {
        debug(e);
        return Promise.reject(e);
    }

    if (minify) {
        return minifier(html, {
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeAttributeQuotes: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        });
    }

    if (autoEnd) {
        await end();
    }

    return html;
}

async function screenshot(options) {
    debug('screenshot');
    let buffer, autoEnd, {width, crop, format, evaluate} = parseOptions(options);
    try {
        if (!await webdriver.isLoaded()) {
            autoEnd = true;
            await load(options);
        }
        buffer = await webdriver.getScreenshot(width, evaluate);
        if (crop || format) {
            await imager.load(buffer);
            if (util.isJPEG(format)) {
                imager.toJPEG();
            }
            imager.crop(parseCrop(crop));
            return await imager.getBuffers();
        }

        if (autoEnd) {
            await end();
        }

        return {
            full: buffer
        };

    } catch (e) {
        debug(e);
        return Promise.reject(e);
    }
}

function extract(html, opts) {
    if (opts.table) {
        return extr.table(html, opts);
    }

    return extr(html, opts);
}

function parseOptions(options) {
    if (!options) {
        return {};
    }

    if (typeof options === 'string') {
        return {
            url: options
        };
    }

    if (typeof options === 'object') {
        return options;
    }
}

function parseCrop(crop) {
    if (!crop || !crop.length) {
        return [];
    }

    if (typeof crop === 'string') {
        return [split(crop)];
    }

    return _.map(crop, split);

    function split(size) {
        if (typeof size === 'object') {
            return size;
        }
        if (typeof size === 'string') {
            let splitted = size.split('X');
            return {
                width: splitted[0],
                height: splitted[1]
            };
        }

        return {};
    }
}
