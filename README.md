split-html
==========

<a href="http://apostrophenow.org/"><img src="https://raw.githubusercontent.com/punkave/split-html/master/logos/logo-box-madefor.png" align="right" /></a>

Given a string containing an HTML fragment, split that string into two or more **correctly balanced** HTML fragments wherever the specified selector is found. Returns both the new fragments and the elements that matched the selector, in alternation. **Works on the server and in the browser.** Powered by Cheerio on the server side, jQuery in the browser.

```javascript
var splitHtml = require('split-html');
var html = '<div>' +
  '<h4>First component.</h4>' +
  '<img src="/test.jpg">' +
  '<p>Second component.</p>' +
  '</div>';
var fragments = splitHtml(html, 'img');
console.log(fragments);
```

This outputs:

```javascript
[
  '<div><h4>First component.</h4></div>',
  '<img src="/test.jpg">',
  '<div><p>Second component.</p></div>'
]
```

Note that the `img` itself is returned. The first element in the array is always an HTML fragment, the second is always an element that matched the selector, and so on in alternation.

**Any container tags already open when the `img` tag is encountered are automatically closed at the end of the first fragment and re-opened at the start of the next one with the same attributes.**

## Optional test function

If a jQuery/CSS-style selector isn't specific enough, you can pass a function as the third argument. This function is called with a Cheerio or jQuery object representing the matching element. If you want to split around this element, return `true`. Otherwise, return `false`.

This is useful because Cheerio does not currently support `:has`, and also because in some situations even `:has` might not be specific enough.

```javascript
// Split on 'a', but only if it contains 'img'
var result = splitHtml(html, 'a', function($el) {
  if ($el.find('img').length) {
    return true;
  } else {
    return false;
  }
});
```

## Why?

We wanted to import Wordpress blog posts into the [Apostrophe](http://apostrophenow.org) CMS. Wordpress uses HTML to embed images and videos, while Apostrophe represents blocks of text and widgets like slideshows as separate objects in an array. `split-html` allows us to neatly slice and dice existing HTML so we can transform it into Apostrophe widgets easily.

## What about errors?

If `split-html` encounters something it can't figure out, such as terrible markup, it will return the original string as the only element in the array.

## Using split-html in the browser

`split-html` has been coded to work with either Cheerio or actual jQuery. It will automatically just use jQuery if that is present in the browser. We use this feature in production in [Apostrophe](http://apostrophenow.org)'s rich text editor.

## About P'unk Avenue and Apostrophe

`split-html` was created at [P'unk Avenue](http://punkave.com) for use in many projects built with Apostrophe, an open-source content management system built on node.js. If you like `split-html` you should definitely [check out apostrophenow.org](http://apostrophenow.org).

## Support

Feel free to open issues on [github](http://github.com/punkave/split-html).

<a href="http://punkave.com/"><img src="https://raw.githubusercontent.com/punkave/split-html/master/logos/logo-box-builtby.png" /></a>

## Changelog

### CHANGES IN 1.0.1

* Clarified that this code is mature for browser use as well. No code changes.

### CHANGES IN 1.0.0

* Updated documentation and released 1.0.0 stable. No code changes.

### CHANGES IN 0.1.1

* Works correctly with actual jQuery, in addition to working correctly in node with Cheerio as before. This required changes to be more pedantic about closing parent tags in the first fragment, and a better simulation of Cheerio's document object.
* Handles nested parent elements correctly.

### CHANGES IN 0.1.0

Initial release. With shiny unit tests, of course.
