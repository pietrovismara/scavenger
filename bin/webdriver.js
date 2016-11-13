"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var end = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        debug('end');

                        if (!nightmare) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 4;
                        return nightmare.end(function () {
                            nightmare = undefined;
                            debug('stopped nightmare');
                        });

                    case 4:
                        return _context.abrupt('return', _context.sent);

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function end() {
        return _ref.apply(this, arguments);
    };
}();

var waitForElement = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(selector) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return nightmare.evaluate(function (_selector, done) {
                            var interval = setInterval(function () {
                                var element = document.querySelector(_selector);
                                if (!element) {
                                    return;
                                }

                                if (element.childElementCount > 0) {
                                    clearInterval(interval);
                                    setTimeout(function () {
                                        done();
                                    });
                                }
                            }, 50);
                        }, selector);

                    case 3:
                        _context2.next = 10;
                        break;

                    case 5:
                        _context2.prev = 5;
                        _context2.t0 = _context2['catch'](0);

                        end();
                        debug(_context2.t0);
                        return _context2.abrupt('return', false);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 5]]);
    }));

    return function waitForElement(_x) {
        return _ref2.apply(this, arguments);
    };
}();

var getScreenshot = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
        var dimensions;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        _context3.next = 3;
                        return nightmare.evaluate(hideScrollbar);

                    case 3:
                        _context3.next = 5;
                        return nightmare.evaluate(getPageDimensions);

                    case 5:
                        dimensions = _context3.sent;
                        _context3.next = 8;
                        return nightmare.viewport(dimensions.width, dimensions.height).wait(1000).screenshot();

                    case 8:
                        return _context3.abrupt('return', _context3.sent);

                    case 11:
                        _context3.prev = 11;
                        _context3.t0 = _context3['catch'](0);

                        end();
                        debug(_context3.t0);
                        return _context3.abrupt('return', false);

                    case 16:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[0, 11]]);
    }));

    return function getScreenshot() {
        return _ref3.apply(this, arguments);
    };
}();

var getHTML = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        _context4.next = 3;
                        return nightmare.evaluate(function () {
                            return document.documentElement.innerHTML;
                        });

                    case 3:
                        return _context4.abrupt('return', _context4.sent);

                    case 6:
                        _context4.prev = 6;
                        _context4.t0 = _context4['catch'](0);

                        end();
                        debug(_context4.t0);
                        return _context4.abrupt('return', _context4.t0);

                    case 11:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 6]]);
    }));

    return function getHTML() {
        return _ref4.apply(this, arguments);
    };
}();

var isLoaded = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        if (nightmare) {
                            _context5.next = 2;
                            break;
                        }

                        return _context5.abrupt('return', false);

                    case 2:
                        _context5.next = 4;
                        return nightmare.url();

                    case 4:
                        return _context5.abrupt('return', !!_context5.sent);

                    case 5:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function isLoaded() {
        return _ref5.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('scavenger:webdriver');
var Nightmare = require('nightmare');

var webdriver = (0, _defineProperty3.default)({
    load: load,
    end: end,
    waitForElement: waitForElement,
    getScreenshot: getScreenshot,
    getHTML: getHTML,
    isLoaded: isLoaded
}, 'end', end);

module.exports = webdriver;

var nightmare = void 0;

function load(url, waitMs, debugMode) {
    debug('Loading: ' + url);
    waitMs = waitMs || 2000;
    nightmare = new Nightmare({
        show: false,
        frame: false
    });

    if (debugMode) {
        nightmare.on('page', function (type, message, stack) {
            debug(type, message, stack);
        }).on('console', function (type, arg1, arg2) {
            debug(type, arg1, arg2);
        });
    }
    return nightmare.goto(url).wait(waitMs).catch(function (err) {
        debug(err);
        end();
        return _promise2.default.reject(err);
    });
}

function hideScrollbar() {
    var sheet = function () {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style.sheet;
    }();
    sheet.insertRule('.element::-webkit-scrollbar { width: 0 !important }', 0);
}

function getPageDimensions() {
    var body = document.querySelector('body');
    return {
        height: body.scrollHeight,
        width: body.scrollWidth
    };
}