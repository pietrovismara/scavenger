# Scavenger

Command line tool / Node.js package using [Nightmare](http://www.nightmarejs.org/) to scrape/take screenshots of dynamic and static webpages.

# Features

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

scavenger.scrape("https://reddit.com")
.then((html) => {    
    return scavenger.screenshot()
})
.then((buffers) => {    
    return scavenger.end();
    // Don't forget to call end! Otherwise you'll have memory leaks
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
**.end()**

This method should always be called before scraping other pages.
Calls `nightmare.end()`.
Complete any queue operations, disconnect and close the electron process.

```javascript
scavenger.scrape("https://reddit.com")
.then(() => {
    return scavenger.end();
});
```



# License

MIT
