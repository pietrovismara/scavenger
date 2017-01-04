# Examples

**List items**

Readapted (simplified for example) from [source](https://www.npmjs.com/search?q=redis)

Let's say we want to get the top results for redis packages on npm and group them by author.

The page markup is composed like this:

```html
<ul class="search-results">
    <li>
        <div class="package-details">
            <h3>
              <a class="name" href="/package/redis">redis</a>
              &nbsp;&nbsp;<a class="author" href="/~bridgear">bridgear</a>
            </h3>

            <p class="description">Redis client library</p>

            <p class="stats">
                <span class="stars"><i class="icon-star"></i>78</span> &nbsp;&nbsp;
                <span class="version">v2.6.3</span>
            </p>

            <p class="keywords">
                <i class="icon-tag"></i> database,&nbsp; redis,&nbsp; transaction,&nbsp; pipelining,&nbsp; performance,&nbsp; queue,&nbsp; nodejs,&nbsp; pubsub,&nbsp; backpressure
            </p>

        </div>
    </li>
    <li>
        <div class="package-details">
            <h3>
              <a class="name" href="/package/connect-redis">connect-redis</a>
              &nbsp;&nbsp;<a class="author" href="/~wavded">wavded</a>
            </h3>

            <p class="description">Redis session store for Connect</p>

            <p class="stats">
                <span class="stars"><i class="icon-star"></i>78</span> &nbsp;&nbsp;
                <span class="version">v3.1.0</span>
            </p>
        </div>
    </li>
    <li>
        <div class="package-details">
            <h3>
              <a class="name" href="/package/redis-commands">redis-commands</a>
              &nbsp;&nbsp;<a class="author" href="/~bridgear">bridgear</a>
            </h3>


            <p class="description">Redis commands</p>

            <p class="stats">
                <span class="stars"><i class="icon-star"></i>76</span> &nbsp;&nbsp;
                <span class="version">v1.3.0</span>
            </p>

            <p class="keywords">
                <i class="icon-tag"></i> redis,&nbsp; commands,&nbsp; prefix
            </p>

        </div>
    </li>
</ul>
```

We proceed like this:

```javascript
const extract = scavenger.createExtractor({
    scope: 'ul.search-results li',
    fields: {
        name: 'h3 a.name',
        author: 'h3 a.author',
        description: 'p.description',
        stars: 'p.stats span.stars',
        version: 'p.stats span.version'
    }
});

scavenger.scrape('https://www.npmjs.com/search?q=redis', extract)
.then((packages) => {

})
```

The result will be an array of objects representing the contents of the page:

```json
[
    {
        "name": "redis",
        "author": "bridgear",
        "description": "Redis client library",
        "stars": "78",
        "version": "v2.6.3"
    },
    {
        "name": "connect-redis",
        "author": "wavded",
        "description": "Redis session store for Connect",
        "stars": "78",
        "version": "v3.1.0"
    },
    {
        "name": "redis-commands",
        "author": "bridgear",
        "description": "Redis commands",
        "stars": "76",
        "version": "v1.3.0"
    },
    ...,
]

```   

Passing the option `groupBy: 'author'` to `.createExtractor`:

```json
{
    "bridgear": [
        {
            "name": "redis",
            "author": "bridgear",
            "description": "Redis client library",
            "stars": "78",
            "version": "v2.6.3"
        },
        {
            "name": "redis-commands",
            "author": "bridgear",
            "description": "Redis commands",
            "stars": "76",
            "version": "v1.3.0"
        }
    ],
    "wavded": [
        {
            "name": "connect-redis",
            "author": "wavded",
            "description": "Redis session store for Connect",
            "stars": "78",
            "version": "v3.1.0"
        }
    ],
    ...,
}

```

** Table **

Readapted (simplified for example) from [source](http://sports.williamhill.it/bet_ita/it/betting/t/321/Serie+A.html)

In this case we want to extract soccer matches from a table on a sport betting site.

The page markup is composed like this:

```html
<div class="marketHolderExpanded">
    <table cellpadding="0" cellspacing="0" border="1" width="100%" class="tableData">
        <tbody>
            <tr class="rowOdd">
                <td scope="col" class="leftPad">
                    <a class="liveat">Oggi</a>
                </td>
                <td scope="col" class="leftPad">
                    <a class="leftPad">18:00</a>
                </td>
                <td scope="col" class="leftPad">
                    <a href="http://sports.williamhill.it/bet_ita/it/betting/e/10305191/Crotone+%2d+Pescara.html"><span id="10305191_mkt_namespace">Crotone &nbsp; - &nbsp;&nbsp;Pescara</span></a>
                </td>
                <td scope="col">
                </td>
                <td scope="col">
                    <div class="eventpriceholder-left ">
                        <div class="eventprice">
                            2.62
                        </div>
                        <div class="clearBoth"></div>
                    </div>
                </td>
                <td scope="col">
                    <div class="eventpriceholder-left">
                        <div class="eventprice">
                            3.30
                        </div>
                        <div class="clearBoth"></div>
                    </div>
                </td>
                <td scope="col">
                    <div class="eventpriceholder-left" onclick="document.betslip.add_leg(this,'','L','9','5','','','1405926702')" onmouseover="addClass(this, 'pricemouseover'); return false" onmouseout="removeClass(this, 'pricemouseover'); return false">
                        <div id="tup_selection1405926702price" class="eventprice">
                            2.80
                        </div>
                        <div class="clearBoth"></div>
                    </div>
                </td>
                <td scope="col">
                    <div>
                        <a href="http://sports.williamhill.it/bet_ita/it/betting/e/10305191/Crotone+%2d+Pescara.html" title="Altre scommesse">
                            <nobr>+ 90 Scommesse</nobr>
                        </a>
                    </div>
                </td>
            </tr>
            <tr class="rowOdd">
                <td scope="col" class="leftPad">
                    <span>18 Dic</span>
                </td>
                <td scope="col" class="leftPad">
                    <span>15:00 </span>
                </td>
                <td scope="col" class="leftPad">
                    <a href="http://sports.williamhill.it/bet_ita/it/betting/e/10324408/Udinese+%2d+Crotone.html"><span id="10324408_mkt_namespace">Udinese &nbsp; - &nbsp;&nbsp;Crotone</span></a>
                </td>
                <td scope="col">
                </td>
                <td scope="col">
                    <div class="eventpriceholder-left">
                        <div class="eventprice">
                            1.66
                        </div>
                        <div class="clearBoth"></div>
                    </div>
                </td>
                <td scope="col">
                    <div class="eventpriceholder-left">
                        <div class="eventprice">
                            3.60
                        </div>
                        <div class="clearBoth"></div>
                    </div>
                </td>
                <td scope="col">
                    <div class="eventpriceholder-left">
                        <div class="eventprice">
                            5.50
                        </div>
                        <div class="clearBoth"></div>
                    </div>
                </td>
                <td scope="col">
                    <div>
                        <a href="http://sports.williamhill.it/bet_ita/it/betting/e/10324408/Udinese+%2d+Crotone.html" title="Altre scommesse">
                            <nobr>+ 71 Scommesse</nobr>
                        </a>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```
Our code:

```javascript
const extract = scavenger.createExtractor({
    scope: '.rowOdd',
    fields: {
        date: 'td:nth-child(1) span',
        time: 'td:nth-child(2) span',
        teams: 'td:nth-child(3) a span',
        '1': 'td:nth-child(5) div div',
        X: 'td:nth-child(6) div div',
        '2': 'td:nth-child(7) div div',
        betsAmount: 'td:nth-child(8) div a nobr'
    },
    groupBy: 'teams'
});

scavenger.scrape('http://sports.williamhill.it/bet_ita/it/betting/t/315/Germania+Bundesliga.html', extract)
.then((matches) => {

});

```

The result is the following:

```json
{
    "Crotone   -   Pescara": [
        {
            "date": "Oggi",
            "time": "18:00",
            "teams": "Crotone   -   Pescara",
            "1": "2.62",
            "X": "3.30",
            "2": "2.80",
            "betsAmount": "+ 90 Scommesse"
        }
    ],
    "Udinese   -   Crotone": [
        {
            "date": "18 Dic",
            "time": "15:00",
            "teams": "Udinese   -   Crotone",
            "1": "1.66",
            "X": "3.60",
            "2": "5.50",
            "betsAmount": "+ 71 Scommesse"
        }
    ]
}
```
