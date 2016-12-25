const debug = require('debug')('scavenger:nightmare');
const Nightmare = require('nightmare');

let nightmare;

module.exports = {
    init: init,
    get: get,
    end: end,
    isLoaded: isLoaded
};

function init(debugMode) {
    nightmare = nightmare || new Nightmare({
        show: false,
        frame: false
    });

    if (debugMode) {
        nightmare
        .on('page', (type, message, stack) => {
            debug(type, message, stack);
        })
        .on('console', (type, arg1, arg2) => {
            debug(type, arg1, arg2);
        })
    }

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
