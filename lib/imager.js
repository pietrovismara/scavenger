"use strict";
const _ = require('lodash');
const Promise = require('bluebird');
const debug = require('debug')('scavenger:imager');
const jimp = require('jimp');

let mime = jimp.MIME_PNG;

let imager = {
    load: load,
    toJPEG: toJPEG,
    crop: crop,
    getBuffers: getBuffers
};

module.exports = imager;

let images = {};
function load(buffer) {
    debug('load');
    return jimp.read(buffer)
    .then(image => images.full = image)
    .catch((err) => {
        debug(err);
        return Promise.reject(err);
    });
}

function toJPEG(quality, background) {
    debug('toJPEG');
    quality = quality || 60;
    background = background || 0xFFFFFFFF;
    _.forOwn(images, (image) => {
        image
        .quality(quality)
        .background(background); // Forces white background
    });
    mime = jimp.MIME_JPEG;
    return imager;
}

function crop(cropFormats) {
    debug('crop');
    _.forEach(cropFormats, format => applyCropFormat(format.width, format.height));
    return imager;
}

function getBuffer(image) {
    return new Promise((resolve) => {
        image.getBuffer(mime, (err, convertedBuffer) => {
            if (err) {
                debug(err);
                resolve(err);
            }

            resolve(convertedBuffer);
        });
    });
}

async function getBuffers() {
    debug('getBuffers');
    let buffers = {};
    return Promise.each(Object.keys(images), (key) => {
        return getBuffer(images[key], toJPEG)
        .then((buffer) => {
            buffers[key] = buffer;
        });
    })
    .then(() => {
        mime = jimp.MIME_PNG;
        return buffers;
    });
}

function applyCropFormat(width, height) {
    debug('applyCropFormat');
    let clone = images.full.clone();
    clone.crop(0, 0, Number(width), Number(height));
    debug(`setting ${width}X${height}`);
    images[`${width}X${height}`] = clone;
}
