'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var isLoaded = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (nightmare) {
                            _context2.next = 2;
                            break;
                        }

                        return _context2.abrupt('return', _promise2.default.resolve(false));

                    case 2:
                        _context2.next = 4;
                        return nightmare.url();

                    case 4:
                        return _context2.abrupt('return', !!_context2.sent);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function isLoaded() {
        return _ref2.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var debug = require('debug')('scavenger:nightmare');
var Nightmare = require('nightmare');

var defaultOptions = {
    show: false,
    frame: false,
    switches: {
        'ignore-certificate-errors': true
    }
};

var nightmare = void 0;

module.exports = {
    init: init,
    get: get,
    end: end,
    isLoaded: isLoaded
};

function init(options) {
    options = options || {};
    options = _.assign({}, options, defaultOptions);

    nightmare = nightmare || new Nightmare(options);
    return nightmare;
}

function get() {
    return nightmare;
}