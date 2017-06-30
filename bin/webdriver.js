'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var waitForElement = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(selector) {
        var test;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        debug('waitForElement: ' + selector);

                        if (selector) {
                            _context.next = 3;
                            break;
                        }

                        return _context.abrupt('return', false);

                    case 3:
                        _context.prev = 3;
                        _context.next = 6;
                        return nightmare.get().evaluate(function (_selector, done) {
                            var interval = setInterval(function () {
                                var element = document.querySelector(_selector);
                                if (!element) {
                                    return;
                                }

                                if (element.innerHTML.length) {
                                    clearInterval(interval);
                                    setTimeout(function () {
                                        done(null, element.innerHTML);
                                    });
                                }
                            }, 50);
                        }, selector);

                    case 6:
                        test = _context.sent;
                        _context.next = 14;
                        break;

                    case 9:
                        _context.prev = 9;
                        _context.t0 = _context['catch'](3);

                        end();
                        debug(_context.t0);
                        return _context.abrupt('return', false);

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[3, 9]]);
    }));

    return function waitForElement(_x) {
        return _ref.apply(this, arguments);
    };
}();

var getScreenshot = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(width, driverFn) {
        var driver, dimensions;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        debug('getScreenshot');
                        driver = nightmare.get();
                        _context2.prev = 2;

                        if (driverFn) {
                            evalDriverFn(driverFn, driver)();
                        }

                        _context2.next = 6;
                        return driver.evaluate(getPageDimensions);

                    case 6:
                        dimensions = _context2.sent;

                        width = width ? Number(width) : dimensions.width;
                        _context2.next = 10;
                        return driver.viewport(width, dimensions.height).wait(1000);

                    case 10:
                        _context2.next = 12;
                        return driver.evaluate(hideScrollbar);

                    case 12:
                        _context2.next = 14;
                        return driver.screenshot();

                    case 14:
                        return _context2.abrupt('return', _context2.sent);

                    case 17:
                        _context2.prev = 17;
                        _context2.t0 = _context2['catch'](2);

                        end();
                        debug(_context2.t0);
                        return _context2.abrupt('return', _promise2.default.reject(_context2.t0));

                    case 22:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[2, 17]]);
    }));

    return function getScreenshot(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

var getHTML = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(driverFn) {
        var driver;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        debug('getHTML');
                        driver = nightmare.get();
                        _context3.prev = 2;

                        if (driverFn) {
                            evalDriverFn(driverFn, driver)();
                        }
                        _context3.next = 6;
                        return driver.evaluate(function () {
                            var node = document.doctype;
                            if (!node) {
                                return document.documentElement.innerHTML;
                            }
                            var doctype = "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>';
                            return doctype + '\n' + document.documentElement.innerHTML;
                        });

                    case 6:
                        return _context3.abrupt('return', _context3.sent);

                    case 9:
                        _context3.prev = 9;
                        _context3.t0 = _context3['catch'](2);

                        end();
                        debug(_context3.t0);
                        return _context3.abrupt('return', _promise2.default.reject(_context3.t0));

                    case 14:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[2, 9]]);
    }));

    return function getHTML(_x4) {
        return _ref3.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('scavenger:webdriver');
var nightmare = require('./nightmare');

module.exports = {
    load: load,
    end: end,
    waitForElement: waitForElement,
    getScreenshot: getScreenshot,
    getHTML: getHTML,
    setUserAgent: setUserAgent,
    isLoaded: isLoaded,
    goto: goto
};

function load(url, debugMode) {
    nightmare.init(debugMode);
}

function setUserAgent(useragent) {
    debug('setting useragent: ' + useragent);
    useragent = useragent || 'Scavenger - https://www.npmjs.com/package/scavenger';
    return nightmare.get().useragent(useragent);
}

function goto(url, waitMs) {
    debug('goto: ' + url);
    var driver = nightmare.get();
    return driver.goto(url).wait(waitMs).catch(function (err) {
        debug(err);
        end();
        if (!(err instanceof Error) && err.details) {
            return _promise2.default.reject(new Error(err.message + ': ' + err.details));
        }
        return _promise2.default.reject(err);
    });
}

function end() {
    return nightmare.end();
}

function isLoaded() {
    return nightmare.isLoaded();
}

function hideScrollbar(done) {
    if (document.readyState === "complete") {
        run();
        done();
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            run();
            done();
        });
    }

    function run() {
        var sheet = function () {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            return style.sheet;
        }();
        sheet.insertRule('::-webkit-scrollbar { width: 0 !important; display: none; }', 0);
    }
}

function getPageDimensions() {
    var body = document.querySelector('body');
    return {
        height: body.scrollHeight,
        width: body.scrollWidth
    };
}

function evalFn(fnString) {
    return eval('(' + fnString + ')');
}

function evalDriverFn(fn, driver) {
    debug('evalDriverFn');
    if (typeof fn === 'string') {
        fn = evalFn(fn);
    }
    return fn.bind(driver);

    // TODO find a way to extract a subset of driver methods like the following
    // without breaking nightmare context:
    // return fn.bind({
    //     wait: driver.wait,
    //     insert: driver.insert,
    //     type: driver.type,
    //     click: driver.click,
    //     select: driver.select,
    //     check: driver.check,
    //     uncheck: driver.uncheck,
    //     mousedown: driver.mousedown,
    //     mouseup: driver.mouseup,
    //     mouseover: driver.mouseover,
    //     evaluate: driver.evaluate,
    //     _queue: driver._queue
    // });
}