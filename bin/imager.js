"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getBuffers = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var buffers;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        debug('getBuffers');
                        buffers = {};
                        return _context.abrupt('return', Promise.each((0, _keys2.default)(images), function (key) {
                            return getBuffer(images[key], toJPEG).then(function (buffer) {
                                buffers[key] = buffer;
                            });
                        }).then(function () {
                            mime = jimp.MIME_PNG;
                            return buffers;
                        }));

                    case 3:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getBuffers() {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var Promise = require('bluebird');
var debug = require('debug')('scavenger:imager');
var jimp = require('jimp');

var mime = jimp.MIME_PNG;

var imager = {
    load: load,
    toJPEG: toJPEG,
    crop: crop,
    getBuffers: getBuffers
};

module.exports = imager;

var images = {};
function load(buffer) {
    debug('load');
    return jimp.read(buffer).then(function (image) {
        return images.full = image;
    }).catch(function (err) {
        debug(err);
        return Promise.reject(err);
    });
}

function toJPEG(quality, background) {
    debug('toJPEG');
    quality = quality || 60;
    background = background || 0xFFFFFFFF;
    _.forOwn(images, function (image) {
        image.quality(quality).background(background); // Forces white background
    });
    mime = jimp.MIME_JPEG;
    return imager;
}

function crop(cropFormats) {
    debug('crop');
    _.forEach(cropFormats, function (format) {
        return applyCropFormat(format.width, format.height);
    });
    return imager;
}

function getBuffer(image) {
    return new Promise(function (resolve) {
        image.getBuffer(mime, function (err, convertedBuffer) {
            if (err) {
                debug(err);
                resolve(err);
            }

            resolve(convertedBuffer);
        });
    });
}

function applyCropFormat(width, height) {
    debug('applyCropFormat');
    var clone = images.full.clone();
    clone.crop(0, 0, Number(width), Number(height));
    debug('setting ' + width + 'X' + height);
    images[width + 'X' + height] = clone;
}