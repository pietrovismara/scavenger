"use strict";

const _ = require('lodash');
const Promise = require('bluebird');
const querystring = require('querystring');
const minifier = require('html-minifier').minify;
const debug = require('debug')('scavenger:scavenger');
const webdriver = require(`./webdriver`);
const imager = require(`./imager`);
const util = require(`./util`);
const extr = require(`./extract`);
const parser = require(`./parser`);

const scavenger = {
    screenshot: screenshot,
    scrape: scrape,
    ss: ss,
    extract: extract,
    createExtractor: createExtractor,
    createMapFn: createMapFn,
    paginateUrl: paginateUrl
};

module.exports = scavenger;

function end() {
    return webdriver.end();
}

async function ss() {
    debug('ss');
    const {tasks, options, mapFunc} = parser.parseArgs(arguments);

    webdriver.load();
    const results = await Promise.mapSeries(tasks, async (task) => {
        task = parser.parseOptions(task);
        const opt = task.options || options;
        await webdriver.goto(task.url, opt.waitMs);
        const html = await scrapeOnce(opt);
        const buffers = await screenshotOnce(opt);

        return {
            html: mapFunc(html),
            buffers: mapFunc(buffers)
        };
    });

    await end();
    return results.length > 1 ? results : results[0];
}

async function screenshot() {
    debug('screenshot');
    const {tasks, options, mapFunc} = parser.parseArgs(arguments);

    webdriver.load();
    const results = await Promise.mapSeries(tasks, async (task) => {
        task = parser.parseOptions(task);
        const opt = task.options || options;
        await webdriver.setUserAgent(opt.useragent);
        await webdriver.goto(task.url, opt.waitMs);
        const buffers = await screenshotOnce(opt);
        return mapFunc(buffers);
    });

    await end();
    return results.length > 1 ? results : results[0];
}

async function scrape() {
    debug('scrape');
    const {tasks, options, mapFunc} = parser.parseArgs(arguments);

    webdriver.load();
    const results = await Promise.mapSeries(tasks, async (task) => {
        task = parser.parseOptions(task);
        const opt = task || options;
        await webdriver.setUserAgent(opt.useragent);        
        await webdriver.goto(opt.url, opt.waitMs);
        const html = await scrapeOnce(opt);
        return mapFunc(html);
    });

    await end();
    return results.length > 1 ? results : results[0];
}

async function scrapeOnce(options) {
    const {url, minify, driverFn} = parser.parseOptions(options);
    let html, autoEnd;
    try {
        if (!await webdriver.isLoaded()) {
            autoEnd = true;
            webdriver.load();
            await webdriver.goto(url);
        }

        html = await webdriver.getHTML(driverFn);
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

async function screenshotOnce(options) {
    const {url, width, crop, format, driverFn} = parser.parseOptions(options);
    let buffer, autoEnd;

    try {
        if (!await webdriver.isLoaded()) {
            autoEnd = true;
            webdriver.load();
            await webdriver.goto(url);
        }

        buffer = await webdriver.getScreenshot(width, driverFn);
        if (crop || format) {
            await imager.load(buffer);
            if (util.isJPEG(format)) {
                imager.toJPEG();
            }
            imager.crop(parser.parseCrop(crop));
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

function createExtractor(options, fn) {
    return createMapFn(options, fn ? fn : extract);
}

function createMapFn(options, fn) {
    return function(data) {
        return fn(data, options)
    };
}

function extract(html, opts) {
    opts = parser.parseExtractOptions(opts);
    _.forEach(opts.fields, (field, key) => {
        opts.fields[key] = parser.parseField(field);
    });

    return extr(html, opts);
}

function paginateUrl(options) {
    const {baseUrl, params, paginationParam, limit, step} = options;
    const urls = [];
    while (params[paginationParam] < limit) {
        urls.push(`${baseUrl}${querystring.stringify(params)}`);
        params[paginationParam] += step;
    }
    return urls;
}
