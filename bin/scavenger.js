"use strict";

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var load = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(options) {
        var _parseOptions, url, selector;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _parseOptions = parseOptions(options), url = _parseOptions.url, selector = _parseOptions.selector;
                        _context.prev = 1;

                        if (url) {
                            _context.next = 4;
                            break;
                        }

                        throw new Error('Missing URL');

                    case 4:
                        _context.next = 6;
                        return util.isUrlReachable(url);

                    case 6:
                        if (_context.sent) {
                            _context.next = 8;
                            break;
                        }

                        throw new Error("Invalid or unreachable URL");

                    case 8:
                        _context.next = 10;
                        return webdriver.load(url);

                    case 10:
                        if (!selector) {
                            _context.next = 13;
                            break;
                        }

                        _context.next = 13;
                        return webdriver.waitForElement(selector);

                    case 13:
                        _context.next = 19;
                        break;

                    case 15:
                        _context.prev = 15;
                        _context.t0 = _context['catch'](1);

                        debug(_context.t0);
                        return _context.abrupt('return', _promise2.default.reject(_context.t0));

                    case 19:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[1, 15]]);
    }));

    return function load(_x) {
        return _ref.apply(this, arguments);
    };
}();

var scrape = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(options) {
        var html, _parseOptions2, minify;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        debug('scrape');
                        html = void 0, _parseOptions2 = parseOptions(options), minify = _parseOptions2.minify;
                        _context2.prev = 2;
                        _context2.next = 5;
                        return webdriver.isLoaded();

                    case 5:
                        if (_context2.sent) {
                            _context2.next = 8;
                            break;
                        }

                        _context2.next = 8;
                        return load(options);

                    case 8:
                        _context2.next = 10;
                        return webdriver.getHTML();

                    case 10:
                        html = _context2.sent;
                        _context2.next = 17;
                        break;

                    case 13:
                        _context2.prev = 13;
                        _context2.t0 = _context2['catch'](2);

                        debug(_context2.t0);
                        return _context2.abrupt('return', _promise2.default.reject(_context2.t0));

                    case 17:
                        if (!minify) {
                            _context2.next = 19;
                            break;
                        }

                        return _context2.abrupt('return', minifier(html, {
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            removeAttributeQuotes: true,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: true
                        }));

                    case 19:
                        return _context2.abrupt('return', html);

                    case 20:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[2, 13]]);
    }));

    return function scrape(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var screenshot = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(options) {
        var buffer, _parseOptions3, width, crop, format;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        debug('screenshot');
                        buffer = void 0, _parseOptions3 = parseOptions(options), width = _parseOptions3.width, crop = _parseOptions3.crop, format = _parseOptions3.format;
                        _context3.prev = 2;
                        _context3.next = 5;
                        return webdriver.isLoaded();

                    case 5:
                        if (_context3.sent) {
                            _context3.next = 8;
                            break;
                        }

                        _context3.next = 8;
                        return load(options);

                    case 8:
                        _context3.next = 10;
                        return webdriver.getScreenshot(width);

                    case 10:
                        buffer = _context3.sent;

                        if (!(crop || format)) {
                            _context3.next = 19;
                            break;
                        }

                        _context3.next = 14;
                        return imager.load(buffer);

                    case 14:
                        if (util.isJPEG(format)) {
                            imager.toJPEG();
                        }
                        imager.crop(parseCrop(crop));
                        _context3.next = 18;
                        return imager.getBuffers();

                    case 18:
                        return _context3.abrupt('return', _context3.sent);

                    case 19:
                        return _context3.abrupt('return', {
                            full: buffer
                        });

                    case 22:
                        _context3.prev = 22;
                        _context3.t0 = _context3['catch'](2);

                        debug(_context3.t0);
                        return _context3.abrupt('return', _promise2.default.reject(_context3.t0));

                    case 26:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[2, 22]]);
    }));

    return function screenshot(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var minifier = require('html-minifier').minify;
var debug = require('debug')('scavenger:scavenger');
var webdriver = require('./webdriver');
var imager = require('./imager');
var util = require('./util');

var scavenger = {
    load: load,
    scrape: scrape,
    screenshot: screenshot,
    end: end
};

module.exports = scavenger;

function end() {
    return webdriver.end();
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

    if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) === 'object') {
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
        if ((typeof size === 'undefined' ? 'undefined' : (0, _typeof3.default)(size)) === 'object') {
            return size;
        } else if (typeof size === 'string') {
            var splitted = size.split('X');
            return {
                width: splitted[0],
                height: splitted[1]
            };
        }

        return {};
    }
}