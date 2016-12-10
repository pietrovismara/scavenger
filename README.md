# Scavenger

Command line tool / Node.js package using [Nightmare](http://www.nightmarejs.org/) to scrape/take screenshots of dynamic and static webpages.

# Features

0. Can extract data from html and convert it to JSON (only in programmatic use).
0. Supports dynamic (Angularjs, etc) and static web pages.
0. Can be piped to other programs.
0. Can be used from command line or programmatically
0. Runs on any linux based os. (Probably on windows and mac too, but it hasn't been tested yet)

# Install

As a global package:
```shell
$ npm install -g scavenger
```
As a local package:
```shell
$ npm install scavenger
```

# Command line usage

### Help
```shell
$ scavenger -h
```

### Screenshot
Save image to a png file:
```shell
$ scavenger screenshot -u https://reddit.com
$ # Creates a file called https_reddit_com.png
```
Pipe image to ImageMagick display and show it:
```shell
$ scavenger screenshot -u https://reddit.com | display
```

### Scrape
Pipe html to less:
```shell
$ scavenger scrape -u https://reddit.com | less
```
Save html to a file:
```shell
$ scavenger screenshot -u https://reddit.com > reddit.html
```
Or
```shell
$ scavenger screenshot -u https://reddit.com
$ # Creates a file called https_reddit_com.html
```

### Scrape + Screenshot
```shell
$ scavenger ss -u https://reddit.com
```

# Programmatic usage

```javascript
const scavenger = require('scavenger');
```

You can use scavenger methods at once:

```javascript
scavenger.scrape("https://reddit.com")
.then((html) => {    

})
```

Or chain them and reuse the same Nightmarejs process for faster results:

```javascript
scavenger.load("https://reddit.com")
.then(() => {
    return scavenger.scrape() // Can pass options, no url needed
})
.then((html) => {    
    return scavenger.screenshot() // Can pass options, no url needed
})
.then((buffers) => {    
    // Don't forget to call end when you chain methods or
    // the process will keep running and leaking memory
    return scavenger.end();    
})
```

## API
**.scrape()**

Returns a string containing the scraped page html

```javascript
scavenger.scrape(url)
.then((html) => {});

// Or

scavenger.scrape({
    url: String, // Url to scrape
    [selector]: String, // ID of a DOMElement to wait before scraping
    [minify]: Boolean, // If true, minify the html
    [evaluate]: String // A function string to evaluate in the scraped page context
})
.then((html) => {});
```
---------------------
**.screenshot()**

Returns an object of buffers of the screenshot.


```javascript
scavenger.screenshot(url)
.then((buffers) => {
    console.log(buffers);
    // {
    //     "full": <Buffer>
    // }
});

// Or

scavenger.screenshot({
    url: String, // Url to scrape
    [selector]: String, // ID of a DOMElement to wait before scraping
    [format]: String, // Default: png. Available: jpeg, png.
    [crop]: Array [{
        width: Number,
        height: Number
    }],
    [width]: Number // Viewport width in pixels. By default it adapts to the page width. Height is always 100% of the page.
})
.then((buffers) => {
    console.log(buffers);
    // {
    //     "full": <Buffer>,
    //     "1280X680": <Buffer>
    // }
});
```
--------------------------
**.extract()**

See also the [examples](examples/extract.md).

Extracts text from given html and returns it in json format. Supports tables or any element.

Generic HTML elements:

```javascript
scavenger.extract(String, {
    html: String
    containers: String, // css selector
    fields: Object {
        [field name]: String, // css selector
        ...,
    },
    [groupBy]: String // a field name to group results by
});
```

A Table:

```javascript
scavenger.extract(String, {
    html: String
    table: String, // css selector
    headers: Object {
        [header name]: String, // css selector
        ...,
    },
    [groupBy]: String // an header name to group results by
});
```

--------------------------
**.end()**

This method needs to be called only at the end of chained methods execution.

Calls `nightmare.end()`.

Complete any queue operations, disconnect and close the electron process.



# License

MIT
