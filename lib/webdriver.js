const debug = require('debug')('scavenger:webdriver');
const nightmare = require('./nightmare');

module.exports = {
    load: load,
    end: end,
    waitForElement: waitForElement,
    getScreenshot: getScreenshot,
    getHTML: getHTML,
    isLoaded: isLoaded,
    goto: goto
};

function load(url, waitMs, debugMode) {
    nightmare.init(debugMode);
}

function goto(url, waitMs) {
    debug(`goto: ${url}`);
    return nightmare
    .get()
    .goto(url)
    .wait(waitMs)
    .catch((err) => {
        debug(err);
        end();
        if (!(err instanceof Error) && err.details) {
            return Promise.reject(new Error(`${err.message}: ${err.details}`));
        }
        return Promise.reject(err);
    });

}

function end() {
    return nightmare.end();
}

async function waitForElement(selector) {
    try {
        await nightmare.get().evaluate((_selector, done) => {
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

async function getScreenshot(width, driverFn) {
    debug('getScreenshot');
    let driver = nightmare.get();
    try {
        if (driverFn) {
            evalDriverFn(driverFn, driver)();
        }

        let dimensions = await driver.evaluate(getPageDimensions);
        width = width ? Number(width) : dimensions.width;
        await driver
            .viewport(width, dimensions.height)
            .wait(1000);
        await driver.evaluate(hideScrollbar);
        return await driver.screenshot();
    } catch (e) {
        end();
        debug(e);
        return Promise.reject(e);
    }
}

async function getHTML(driverFn) {
    debug('getHTML');
    let driver = nightmare.get();
    try {
        if (driverFn) {
            evalDriverFn(driverFn, driver)();
        }
        return await driver.evaluate(() => {
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
        return Promise.reject(e);
    }
}

function isLoaded() {
    return nightmare.isLoaded();
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

function evalDriverFn(fn, driver) {
    debug('evalDriverFn');
    if (typeof fn === 'string') {
        fn = evalFn(fn);
    }
    return fn.bind(driver);

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
