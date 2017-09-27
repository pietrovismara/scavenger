const _ = require('lodash');
const debug = require('debug')('scavenger:nightmare');
const Nightmare = require('nightmare');

const defaultOptions = {
    show: false,
    frame: false,
    switches: {
        'ignore-certificate-errors': true
    }
};

let nightmare;

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

async function end() {
    debug('end');
    if (nightmare) {
        return await nightmare.end(function () {
            nightmare = undefined;
            debug('stopped nightmare');
        });
    }
}

async function isLoaded() {
    if (!nightmare) {
        return Promise.resolve(false);
    }
    return !! await nightmare.url();
}
