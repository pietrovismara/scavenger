const scavenger = require('./lib/scavenger');
const _ = require('lodash');
const fs = require('fs');

function betclick() {
    const extract = scavenger.createExtractor({
        scope: 'div.match-entry',
        fields: {
            teams: '.match-name a',
            '1': '.match-odd:nth-child(1) span',
            'X': '.match-odd:nth-child(2) span',
            '2': '.match-odd:nth-child(3) span',
        },
        groupBy: 'teams'
    });

    return scavenger.scrape('https://www.betclic.it/calcio/serie-a-e6', extract);
}

function npm() {
    let urls = scavenger.paginateUrl({
        baseUrl: `https://www.npmjs.com/search?`,
        params: {
            q: 'scraping',
            page: 1
        },
        paginationParam: 'page',
        limit: 2,
        step: 1
    });


    let extract = scavenger.createExtractor({
        scope: 'ul.search-results li',
        fields: {
            name: 'h3 a.name',
            author: 'h3 a.author',
            description: 'p.description',
            stars: 'p.stats span.stars',
            version: 'p.stats span.version'
        },
    });

    return scavenger.scrape(urls, extract);
}

function googlePages() {
    const urls = scavenger.paginateUrl({
        baseUrl: 'https://www.google.com/search?',
        params: {
            q: 'nightmarejs scraping',
            start: 0
        },
        paginationParam: 'start',
        limit: 20,
        step: 10
    });

    const extract = scavenger.createExtractor({
        scope: 'div.rc',
        fields: {
            title: 'h3.r a',
            url: {
                selector: 'h3.r a',
                attribute: 'href'
            },
            description: 'div.s span.st'
        }
    });

    return scavenger.ss(urls, extract);
}


function economist() {
    const extract = scavenger.createExtractor({
        scope: 'section',
        fields: {
            title: 'h1.fly-title',
            headline: 'article h2.headline',
            rubric: 'article p.rubric'
        }
    });

    return scavenger.scrape('http://www.economist.com', extract);
}

function williamHill() {
    const extract = scavenger.createExtractor({
        table: '.marketHolderExpanded table',
        headers: ['', 'time', 'teams', '', '1', 'X', '2', 'betsAmount'],
        groupBy: 'teams'
    });

    return scavenger.scrape('http://sports.williamhill.it/bet_ita/it/betting/t/315/Germania+Bundesliga.html', extract);
}

function swite() {
    let extract = scavenger.createExtractor({
        username: '[itemprop="givenName"]'
    });

    return scavenger.scrape(`https://swite.com/elcuz`, {
        selector: '#page',
        driverFn: switeFn
    }, extract);
}

function trenitalia() {
    const extract = scavenger.createExtractor({
        scope: '.solutionRow',
        fields: {
            departureTime: 'td:nth-child(1) .split span.top',
            departureStation: 'td:nth-child(1) .split span.bottom',
            arrivalTime: 'td:nth-child(2) .split span.top',
            arrivalStation: 'td:nth-child(2) .split span.bottom',
            duration: '.descr.text-center',
            price: '.price'
        },
    });

    return scavenger.scrape(`http://www.trenitalia.com/`, {
        driverFn: ev
    }, extract);
}

function ev() {
    return this.insert('#biglietti_fromNew', 'Firenze S. M. Novella')
        .insert('#biglietti_toNew', 'Sesto Fiorentino')
        .click('#formcruscotto [type=submit]')
        .wait('#searchRequestForm');
}

// return swite()
//     .then((res) => {
//         console.log(res);
//     })

return trenitalia()
.then((results) => {
    console.log(results);
    // fs.writeFileSync('./trenitalia.png', results.full);
});

// return williamHill()
// .then((res) => {
//     console.log(res);
// });

console.log("betclick");
betclick()
    .then((res) => {
        console.log(res);
        console.log("npm");
        return npm();
    })
    .then((res) => {
        console.log(res);
        console.log("googlePages");
        return googlePages();
    })
    .then((res) => {
        console.log(res);
        console.log("economist");
        return economist();
    })
    .then((res) => {
        console.log(res);
        console.log("williamHill");
        return williamHill();
    })
    .then((res) => {
        console.log(res);
        console.log("swite");
        return swite();
    })
    .then((res) => {
        console.log(res);
    });


function switeFn() {
    console.log(this.evaluate, evaluate);
    return this.evaluate(evaluate)
    .then(() => {
        console.log("DONE DIOAHANE");
    });

    function evaluate() {
        var menu = document.getElementById('menu');
        if (menu) {
            menu.style.display = 'none';
        }
        var _page = document.getElementById('page');
        if (_page) {
            _page.style['padding-top'] = 0;
        }
    }
}

// async function run() {
//     let bc = await betclick();
//     let wh = await williamHill();
//
//     let matches = _.uniq(_.concat(_.keys(bc), _.keys(wh)));
//     let res = {};
//     _.forEach(matches, (match) => {
//         let normalizedMatch = match.replace(/\s+/g, '');
//         if (!res[normalizedMatch]) {
//             res[normalizedMatch] = [];
//         }
//         if (bc[match]) {
//             res[normalizedMatch].push(_.pick(bc[match], ['1', 'X', '2']));
//         }
//         if (wh[match]) {
//             res[normalizedMatch].push(_.pick(wh[match], ['1', 'X', '2']));
//         }
//     });
//
//     console.log(res);
// }

// run();
// williamHill()\
// .then((res) => {
//     console.log(res);
// });

// console.time('googlePages');
// googlePages()
// .then((res) => {
//     console.timeEnd('googlePages');
//     const fs = require('fs');
//     fs.writeFileSync('./googletest.json', JSON.stringify(res, null, 4));
// });
// scavenger.load();




// console.time('test');
// googlePages()
// .then((pages) => {
//     console.timeEnd('test');
//     let score = -1;
//     let index = 0;
//      _.some(pages, (page) => {
//         // let i = _.findIndex(page, (result) => {
//         //     return result.name === 'scavenger';
//         // });
//         let i = _.findIndex(page, (result) => {
//             return result.title.indexOf('scavenger') > -1;
//         });
//
//         if (i !== -1) {
//             score = index + i + 1;
//             return true;
//         }
//
//         index += page.length;
//     });
//
//     console.log(score);
// });





// betclick()
// .then((res) => {
//     console.log(res);
// });
