"use strict";
const debug = require('debug')('scavenger:webdriver');
const Nightmare = require('nightmare');

let webdriver = {
    load: load,
    end: end,
    waitForElement: waitForElement,
    getScreenshot: getScreenshot,
    getHTML: getHTML,
    isLoaded: isLoaded,
    end: end
};

module.exports = webdriver;

let nightmare;

function load(url, waitMs, debugMode) {
    debug(`Loading: ${url}`);
    waitMs = waitMs || 2000;
    nightmare = new Nightmare({
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
    return nightmare
    .goto(url)
    .wait(waitMs)
    .catch((err) => {
        debug(err);
        end();
        return Promise.reject(err);
    });
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

async function waitForElement(selector) {
    try {
        await nightmare.evaluate((_selector, done) => {
            let interval = setInterval(() => {
                let element = document.querySelector(_selector);
                if (!element) {
                    return;
                }

                if (element.childElementCount > 0) {
                    clearInterval(interval);
                    setTimeout(() => {
                        done();
                    });
                }
            }, 50);
        }, selector);
    } catch (e) {
        end();
        debug(e);
        return false;
    }
}

async function getScreenshot(width, evaluate) {
    debug('getScreenshot');
    try {
        if (evaluate) {
            await nightmare.evaluate(evalFn(evaluate));
        }
        let dimensions = await nightmare.evaluate(getPageDimensions);
        width = width ? Number(width) : dimensions.width;
        await nightmare
            .viewport(width, dimensions.height)
            .wait(1000);
        await nightmare.evaluate(hideScrollbar);
        return await nightmare.screenshot();
    } catch (e) {
        end();
        debug(e);
        return false;
    }
}

async function getHTML(evaluate) {
    debug('getHTML');
    try {
        if (evaluate) {
            await nightmare.evaluate(evalFn(evaluate));
        }
        return await nightmare.evaluate(() => {
            var node = document.doctype;
            var doctype = "<!DOCTYPE "
                + node.name
                + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
                + (!node.publicId && node.systemId ? ' SYSTEM' : '')
                + (node.systemId ? ' "' + node.systemId + '"' : '')
                + '>';
            return `${doctype}\n${document.documentElement.innerHTML}`;
        });
    } catch (e) {
        end();
        debug(e);
        return e;
    }
}

async function isLoaded() {
    if (!nightmare) {
        return false;
    }
    return !! await nightmare.url();
}

function hideScrollbar(done) {
    if (document.readyState === "complete") {
        run();
        done();
    } else {
        document.addEventListener("DOMContentLoaded", function(event) {
            run();
            done();
        });
    }

    function run() {
        let sheet = (function () {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            return style.sheet;
        })();
        sheet.insertRule('::-webkit-scrollbar { width: 0 !important; display: none; }', 0);
    }
}

function getPageDimensions() {
    let body = document.querySelector('body');
    return {
        height: body.scrollHeight,
        width: body.scrollWidth
    };
}

function evalFn(fnString) {
    return eval(`(${fnString})`);
}
