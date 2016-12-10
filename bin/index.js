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

                        // If string is a path to js file, load it
                        if (argv.evaluate && path.parse(argv.evaluate).ext === '.js') {
                            argv.evaluate = fs.readFileSync(argv.evaluate).toString('utf-8');
                        }

                        _context.t0 = argv._[0];
                        _context.next = _context.t0 === 'scrape' ? 7 : _context.t0 === 'screenshot' ? 19 : _context.t0 === 'ss' ? 32 : 49;
                        break;

                    case 7:
                        args = _.pick(argv, ['url', 'name', 'minify', 'selector', 'evaluate']);
                        debug('scrape', args);
                        _context.next = 11;
                        return scavenger.scrape(args);

                    case 11:
                        html = _context.sent;

                        if (!process.stdout.isTTY) {
                            _context.next = 17;
                            break;
                        }

                        _context.next = 15;
                        return writeFile(name + '.html', html);

                    case 15:
                        _context.next = 18;
                        break;

                    case 17:
                        process.stdout.write(html);

                    case 18:
                        return _context.abrupt('break', 49);

                    case 19:
                        args = _.pick(argv, ['url', 'name', 'width', 'crop', 'format', 'selector', 'evaluate']);
                        debug('screenshot', args);
                        _context.next = 23;
                        return scavenger.screenshot(args);

                    case 23:
                        buffers = _context.sent;

                        debug(buffers);

                        if (!process.stdout.isTTY) {
                            _context.next = 30;
                            break;
                        }

                        _context.next = 28;
                        return writeBuffers(name, buffers, args.format);

                    case 28:
                        _context.next = 31;
                        break;

                    case 30:
                        process.stdout.write(buffers.full);

                    case 31:
                        return _context.abrupt('break', 49);

                    case 32:
                        args = _.pick(argv, ['url', 'minify', 'name', 'width', 'crop', 'format', 'selector', 'evaluate']);
                        debug('ss', args);
                        _context.next = 36;
                        return scavenger.load(args);

                    case 36:
                        _context.next = 38;
                        return scavenger.scrape(args);

                    case 38:
                        html = _context.sent;
                        _context.next = 41;
                        return scavenger.screenshot(args);

                    case 41:
                        buffers = _context.sent;
                        _context.next = 44;
                        return scavenger.end();

                    case 44:
                        _context.next = 46;
                        return writeFile(name + '.html', html);

                    case 46:
                        _context.next = 48;
                        return writeBuffers(name, buffers, args.format);

                    case 48:
                        return _context.abrupt('break', 49);

                    case 49:
                        _context.next = 51;
                        return scavenger.end();

                    case 51:
                        _context.t1 = _context.sent;
                        debug(_context.t1);
                        _context.next = 58;
                        break;

                    case 55:
                        _context.prev = 55;
                        _context.t2 = _context['catch'](2);

                        if (_context.t2.message) {
                            process.stdout.write('Error: ' + _context.t2.message + '\n');
                        }

                    case 58:

                        process.exit();

                    case 59:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[2, 55]]);
    }));

    return function exec(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var debug = require('debug')('scavenger:index');
var scavenger = require('./scavenger');
var util = require('./util');

var commandOptions = {
    u: {
        demand: 'Url is required',
        describe: 'Url to scrape',
        alias: 'url'
    },
    n: {
        describe: 'Screenshot filename',
        alias: 'name'
    },
    c: {
        describe: 'Cropping formats in pixels, eg: <width>X<height>',
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
        alias: 'format'
    },
    s: {
        describe: 'HTML selector. Scraper will wait for the respective element to render. Has priority on the selectorChildren option.',
        alias: 'selector'
    },
    w: {
        describe: 'Viewport width in pixels. By default it adapts to the page width. Height is always 100% of the page.',
        alias: 'width'
    },
    e: {
        describe: 'A Javascript function to evaluate in the page context. Can be a path to a file or a string.',
        alias: 'evaluate'
    }
};

if (module.parent) {
    module.exports = scavenger;
} else {
    var argv = require('yargs').usage('Usage: scavenger <command> [options]').example('scavenger screenshot -u https://www.google.it -n test.jpg -c 1200X680 980X560').demand(['scrape', 'screenshot', 'ss']).command('scrape', 'Scrape HTML from the passed url', _.pick(commandOptions, ['u', 'm', 's', 'e', 'ep'])).command('screenshot', 'Take a screenshot of the passed url', _.omit(commandOptions, ['m'])).command('ss', 'Scrape and Screenshot', commandOptions).help().argv;

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