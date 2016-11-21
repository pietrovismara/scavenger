#!/usr/bin/env node
"use strict";

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var exec = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(argv) {
        var args, html, buffers, name;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        args = void 0, html = void 0, buffers = void 0;
                        name = argv.name || util.cleanFilename(argv.url);
                        _context.prev = 2;
                        _context.t0 = argv._[0];
                        _context.next = _context.t0 === 'scrape' ? 6 : _context.t0 === 'screenshot' ? 18 : _context.t0 === 'ss' ? 31 : 44;
                        break;

                    case 6:
                        args = _.pick(argv, ['url', 'name', 'minify', 'selector']);
                        debug('scrape', args);
                        _context.next = 10;
                        return scavenger.scrape(args);

                    case 10:
                        html = _context.sent;

                        if (!process.stdout.isTTY) {
                            _context.next = 16;
                            break;
                        }

                        _context.next = 14;
                        return writeFile(name + '.html', html);

                    case 14:
                        _context.next = 17;
                        break;

                    case 16:
                        process.stdout.write(html);

                    case 17:
                        return _context.abrupt('break', 44);

                    case 18:
                        args = _.pick(argv, ['url', 'name', 'width', 'crop', 'format', 'selector']);
                        debug('screenshot', args);
                        _context.next = 22;
                        return scavenger.screenshot(args);

                    case 22:
                        buffers = _context.sent;

                        debug(buffers);

                        if (!process.stdout.isTTY) {
                            _context.next = 29;
                            break;
                        }

                        _context.next = 27;
                        return writeBuffers(name, buffers, args.format);

                    case 27:
                        _context.next = 30;
                        break;

                    case 29:
                        process.stdout.write(buffers.full);

                    case 30:
                        return _context.abrupt('break', 44);

                    case 31:
                        args = _.pick(argv, ['url', 'minify', 'name', 'width', 'crop', 'format', 'selector']);
                        debug('ss', args);
                        _context.next = 35;
                        return scavenger.scrape(args);

                    case 35:
                        html = _context.sent;
                        _context.next = 38;
                        return scavenger.screenshot(args);

                    case 38:
                        buffers = _context.sent;
                        _context.next = 41;
                        return writeFile(name + '.html', html);

                    case 41:
                        _context.next = 43;
                        return writeBuffers(name, buffers, args.format);

                    case 43:
                        return _context.abrupt('break', 44);

                    case 44:
                        _context.next = 46;
                        return scavenger.end();

                    case 46:
                        _context.t1 = _context.sent;
                        debug(_context.t1);
                        _context.next = 53;
                        break;

                    case 50:
                        _context.prev = 50;
                        _context.t2 = _context['catch'](2);

                        if (_context.t2.message) {
                            process.stdout.write('Error: ' + _context.t2.message + '\n');
                        }

                    case 53:

                        process.exit();

                    case 54:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 50]]);
    }));

    return function exec(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')('scavenger:index');
var scavenger = require('./scavenger');
var util = require('./util');

var commandOptions = {
    u: {
        demand: 'Url is required',
        describe: 'Url to scrape',
        string: 'url',
        alias: 'url'
    },
    n: {
        describe: 'Screenshot filename',
        string: 'n',
        alias: 'name'
    },
    c: {
        describe: 'Cropping formats in pixels, eg: <width>X<height>',
        string: 'c',
        alias: 'crop',
        array: true
    },
    m: {
        describe: 'Minify scraped html',
        boolean: true,
        alias: 'minify'
    },
    f: {
        describe: 'Screenshot format, png or jpeg',
        string: 'f',
        alias: 'format'
    },
    s: {
        describe: 'HTML selector. Scraper will wait for the respective element to render. Has priority on the selectorChildren option.',
        string: 's',
        alias: 'selector'
    },
    w: {
        describe: 'Viewport width in pixels. By default it adapts to the page width. Height is always 100% of the page.',
        string: 'w',
        alias: 'width'
    }
};

if (module.parent) {
    module.exports = scavenger;
} else {
    var argv = require('yargs').usage('Usage: scavenger <command> [options]').example('scavenger screenshot -u https://www.google.it -n test.jpg -c 1200X680 980X560').demand(['scrape', 'screenshot', 'ss']).command('scrape', 'Scrape HTML from the passed url', _.pick(commandOptions, ['u', 'm', 's'])).command('screenshot', 'Take a screenshot of the passed url', _.omit(commandOptions, ['m'])).command('ss', 'Scrape and Screenshot', commandOptions).help().argv;

    exec(argv);
}

function writeBuffers(name, buffers, format) {
    format = format || 'png';
    return _promise2.default.all(_.map(buffers, function (buffer, key) {
        debug(key, buffer);
        return writeFile(name + '_' + key + '.' + format, buffer);
    }));
}

function writeFile(name, body) {
    return new _promise2.default(function (resolve, reject) {
        fs.writeFile(name, body, function (err) {
            if (err) {
                return reject(err);
            }

            resolve();
        });
        debug('Saved file ' + name);
    });
}