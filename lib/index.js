"use strict";

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('scavenger:index');
const scavenger = require(`./scavenger`);
const util = require(`./util`);

let commandOptions = {
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
    let argv = require('yargs')
    .usage('Usage: scavenger <command> [options]')
    .example('scavenger screenshot -u https://www.google.it -n test.jpg -c 1200X680 980X560')
    .demand(['scrape', 'screenshot', 'ss'])
    .command('scrape', 'Scrape HTML from the passed url', _.pick(commandOptions, ['u', 'm', 's', 'e', 'ep']))
    .command('screenshot', 'Take a screenshot of the passed url', _.omit(commandOptions, ['m']))
    .command('ss', 'Scrape and Screenshot', commandOptions)
    .help()
    .argv;

    exec(argv);
}

async function exec(argv) {
    let args, html, buffers;
    let name = argv.name || util.cleanFilename(argv.url);
    try {
        // If string is a path to js file, load it
        if (argv.evaluate && path.parse(argv.evaluate).ext === '.js') {
            argv.evaluate = fs.readFileSync(argv.evaluate).toString('utf-8');
        }

        switch (argv._[0]) {
            case 'scrape':
                args = _.pick(argv, ['url', 'name', 'minify', 'selector', 'evaluate']);
                debug('scrape', args);
                html = await scavenger.scrape(args)
                if (process.stdout.isTTY) {
                    await writeFile(`${name}.html`, html);
                } else {
                    process.stdout.write(html);
                }
            break;
            case 'screenshot':
                args = _.pick(argv, ['url', 'name', 'width', 'crop', 'format', 'selector', 'evaluate']);
                debug('screenshot', args);
                buffers = await scavenger.screenshot(args);
                debug(buffers);
                if (process.stdout.isTTY) {
                    await writeBuffers(name, buffers, args.format);
                } else {
                    process.stdout.write(buffers.full);
                }
            break;
            case 'ss':
                args = _.pick(argv, ['url', 'minify', 'name', 'width', 'crop', 'format', 'selector', 'evaluate']);
                debug('ss', args);
                html = await scavenger.scrape(args);
                buffers = await scavenger.screenshot(args);
                await writeFile(`${name}.html`, html);
                await writeBuffers(name, buffers, args.format);
            break;
        }
        debug(await scavenger.end());
    } catch (e) {
        if (e.message) {
            process.stdout.write(`Error: ${e.message}\n`);
        }
    }

    process.exit();
}

function writeBuffers(name, buffers, format) {
    format = format || 'png';
    return Promise.all(_.map(buffers, (buffer, key) => {
        debug(key, buffer);
        return writeFile(`${name}_${key}.${format}`, buffer);
    }));
}

function writeFile(name, body) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, body, (err) => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
        debug(`Saved file ${name}`);
    });
}
