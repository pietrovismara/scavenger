"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var ss = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        var _this = this;

        var _parser$parseArgs,
            tasks,
            options,
            mapFunc,
            results,
            _args2 = arguments;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        debug('ss');
                        _parser$parseArgs = parser.parseArgs(_args2), tasks = _parser$parseArgs.tasks, options = _parser$parseArgs.options, mapFunc = _parser$parseArgs.mapFunc;


                        webdriver.load(options.nightmareOptions);
                        _context2.next = 5;
                        return Promise.mapSeries(tasks, function () {
                            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(task) {
                                var opt, html, buffers;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                task = parser.parseOptions(task);
                                                opt = _.assign({}, task, options);
                                                _context.next = 4;
                                                return webdriver.goto(task.url, opt.waitMs);

                                            case 4:
                                                _context.next = 6;
                                                return webdriver.waitForElement(opt.selector);

                                            case 6:
                                                _context.next = 8;
                                                return scrapeOnce(opt);

                                            case 8:
                                                html = _context.sent;
                                                _context.next = 11;
                                                return screenshotOnce(opt);

                                            case 11:
                                                buffers = _context.sent;
                                                return _context.abrupt('return', {
                                                    html: mapFunc(html),
                                                    buffers: mapFunc(buffers)
                                                });

                                            case 13:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            }));

                            return function (_x) {
                                return _ref2.apply(this, arguments);
                            };
                        }());

                    case 5:
                        results = _context2.sent;
                        _context2.next = 8;
                        return end();

                    case 8:
                        return _context2.abrupt('return', results.length > 1 ? results : results[0]);

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function ss() {
        return _ref.apply(this, arguments);
    };
}();

var screenshot = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        var _this2 = this;

        var _parser$parseArgs2,
            tasks,
            options,
            mapFunc,
            results,
            _args4 = arguments;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        debug('screenshot');
                        _parser$parseArgs2 = parser.parseArgs(_args4), tasks = _parser$parseArgs2.tasks, options = _parser$parseArgs2.options, mapFunc = _parser$parseArgs2.mapFunc;


                        webdriver.load(options.nightmareOptions);
                        _context4.next = 5;
                        return Promise.mapSeries(tasks, function () {
                            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(task) {
                                var opt, buffers;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                task = parser.parseOptions(task);
                                                opt = _.assign({}, task, options);
                                                _context3.next = 4;
                                                return webdriver.setUserAgent(opt.useragent);

                                            case 4:
                                                _context3.next = 6;
                                                return webdriver.goto(task.url, opt.waitMs);

                                            case 6:
                                                _context3.next = 8;
                                                return webdriver.waitForElement(opt.selector);

                                            case 8:
                                                _context3.next = 10;
                                                return screenshotOnce(opt);

                                            case 10:
                                                buffers = _context3.sent;
                                                return _context3.abrupt('return', mapFunc(buffers));

                                            case 12:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, _this2);
                            }));

                            return function (_x2) {
                                return _ref4.apply(this, arguments);
                            };
                        }());

                    case 5:
                        results = _context4.sent;
                        _context4.next = 8;
                        return end();

                    case 8:
                        return _context4.abrupt('return', results.length > 1 ? results : results[0]);

                    case 9:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function screenshot() {
        return _ref3.apply(this, arguments);
    };
}();

var scrape = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
        var _this3 = this;

        var _parser$parseArgs3,
            tasks,
            options,
            mapFunc,
            results,
            _args6 = arguments;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        debug('scrape');
                        _parser$parseArgs3 = parser.parseArgs(_args6), tasks = _parser$parseArgs3.tasks, options = _parser$parseArgs3.options, mapFunc = _parser$parseArgs3.mapFunc;


                        webdriver.load(options.nightmareOptions);
                        _context6.next = 5;
                        return Promise.mapSeries(tasks, function () {
                            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(task) {
                                var opt, html;
                                return _regenerator2.default.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                task = parser.parseOptions(task);
                                                opt = _.assign({}, task, options);
                                                _context5.next = 4;
                                                return webdriver.setUserAgent(opt.useragent);

                                            case 4:
                                                _context5.next = 6;
                                                return webdriver.goto(opt.url, opt.waitMs);

                                            case 6:
                                                _context5.next = 8;
                                                return webdriver.waitForElement(opt.selector);

                                            case 8:
                                                _context5.next = 10;
                                                return scrapeOnce(opt);

                                            case 10:
                                                html = _context5.sent;
                                                return _context5.abrupt('return', mapFunc(html));

                                            case 12:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, _this3);
                            }));

                            return function (_x3) {
                                return _ref6.apply(this, arguments);
                            };
                        }());

                    case 5:
                        results = _context6.sent;
                        _context6.next = 8;
                        return end();

                    case 8:
                        return _context6.abrupt('return', results.length > 1 ? results : results[0]);

                    case 9:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function scrape() {
        return _ref5.apply(this, arguments);
    };
}();

var scrapeOnce = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(options) {
        var _parser$parseOptions, url, minify, driverFn, nightmareOptions, html, autoEnd;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _parser$parseOptions = parser.parseOptions(options), url = _parser$parseOptions.url, minify = _parser$parseOptions.minify, driverFn = _parser$parseOptions.driverFn, nightmareOptions = _parser$parseOptions.nightmareOptions;
                        html = void 0, autoEnd = void 0;
                        _context7.prev = 2;
                        _context7.next = 5;
                        return webdriver.isLoaded();

                    case 5:
                        if (_context7.sent) {
                            _context7.next = 10;
                            break;
                        }

                        autoEnd = true;
                        webdriver.load(nightmareOptions);
                        _context7.next = 10;
                        return webdriver.goto(url);

                    case 10:
                        _context7.next = 12;
                        return webdriver.getHTML(driverFn);

                    case 12:
                        html = _context7.sent;
                        _context7.next = 19;
                        break;

                    case 15:
                        _context7.prev = 15;
                        _context7.t0 = _context7['catch'](2);

                        debug(_context7.t0);
                        return _context7.abrupt('return', Promise.reject(_context7.t0));

                    case 19:
                        if (!minify) {
                            _context7.next = 21;
                            break;
                        }

                        return _context7.abrupt('return', minifier(html, {
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            removeAttributeQuotes: true,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: true
                        }));

                    case 21:
                        if (!autoEnd) {
                            _context7.next = 24;
                            break;
                        }

                        _context7.next = 24;
                        return end();

                    case 24:
                        return _context7.abrupt('return', html);

                    case 25:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this, [[2, 15]]);
    }));

    return function scrapeOnce(_x4) {
        return _ref7.apply(this, arguments);
    };
}();

var screenshotOnce = function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(options) {
        var _parser$parseOptions2, url, width, crop, format, driverFn, nightmareOptions, buffer, autoEnd;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        _parser$parseOptions2 = parser.parseOptions(options), url = _parser$parseOptions2.url, width = _parser$parseOptions2.width, crop = _parser$parseOptions2.crop, format = _parser$parseOptions2.format, driverFn = _parser$parseOptions2.driverFn, nightmareOptions = _parser$parseOptions2.nightmareOptions;
                        buffer = void 0, autoEnd = void 0;
                        _context8.prev = 2;
                        _context8.next = 5;
                        return webdriver.isLoaded();

                    case 5:
                        if (_context8.sent) {
                            _context8.next = 10;
                            break;
                        }

                        autoEnd = true;
                        webdriver.load(nightmareOptions);
                        _context8.next = 10;
                        return webdriver.goto(url);

                    case 10:
                        _context8.next = 12;
                        return webdriver.getScreenshot(width, driverFn);

                    case 12:
                        buffer = _context8.sent;

                        if (!(crop || format)) {
                            _context8.next = 21;
                            break;
                        }

                        _context8.next = 16;
                        return imager.load(buffer);

                    case 16:
                        if (util.isJPEG(format)) {
                            imager.toJPEG();
                        }
                        imager.crop(parser.parseCrop(crop));
                        _context8.next = 20;
                        return imager.getBuffers();

                    case 20:
                        return _context8.abrupt('return', _context8.sent);

                    case 21:
                        if (!autoEnd) {
                            _context8.next = 24;
                            break;
                        }

                        _context8.next = 24;
                        return end();

                    case 24:
                        return _context8.abrupt('return', {
                            full: buffer
                        });

                    case 27:
                        _context8.prev = 27;
                        _context8.t0 = _context8['catch'](2);

                        debug(_context8.t0);
                        return _context8.abrupt('return', Promise.reject(_context8.t0));

                    case 31:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this, [[2, 27]]);
    }));

    return function screenshotOnce(_x5) {
        return _ref8.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var Promise = require('bluebird');
var querystring = require('querystring');
var minifier = require('html-minifier').minify;
var debug = require('debug')('scavenger:scavenger');
var webdriver = require('./webdriver');
var imager = require('./imager');
var util = require('./util');
var extr = require('./extract');
var parser = require('./parser');

var scavenger = {
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

function createExtractor(options, fn) {
    return createMapFn(options, fn ? fn : extract);
}

function createMapFn(options, fn) {
    return function (data) {
        return fn(data, options);
    };
}

function extract(html, opts) {
    opts = parser.parseExtractOptions(opts);
    _.forEach(opts.fields, function (field, key) {
        opts.fields[key] = parser.parseField(field);
    });

    return extr(html, opts);
}

function paginateUrl(options) {
    var baseUrl = options.baseUrl,
        params = options.params,
        paginationParam = options.paginationParam,
        limit = options.limit,
        step = options.step;

    var urls = [];
    while (params[paginationParam] < limit) {
        urls.push('' + baseUrl + querystring.stringify(params));
        params[paginationParam] += step;
    }
    return urls;
}