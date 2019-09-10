var assert = require("assert");
var splitHtml = require("../index.js");
describe('splitHtml', function(){
  it('Leaves img-free HTML alone when splitting on img', function() {
    var html = '<h4>Hi there.</h4><p>This is fun.</p>Loose text.';
    var result = splitHtml(html, 'img');
    assert(result.length === 1);
    assert(result[0] === html);
  });
  it('Splits into the correct three components in the presence of img', function() {
    var html = '<h4>First component.</h4><img src="/test.jpg"><p>Second component.</p>';
    var result = splitHtml(html, 'img');
    assert(result.length === 3);
    assert(result[0] === '<h4>First component.</h4>');
    assert(result[1] === '<img src="/test.jpg">');
    assert(result[2] === '<p>Second component.</p>');
  });
  it('Correctly closes open tags in the first component and reopens them at the start of the second component', function() {
    var html = '<h3><h4>First component.</h4><img src="/test.jpg"><p>Second component.</p></h3>';
    var result = splitHtml(html, 'img');
    assert(result.length === 3);
    assert(result[0] === '<h3><h4>First component.</h4></h3>');
    assert(result[1] === '<img src="/test.jpg">');
    assert(result[2] === '<h3><p>Second component.</p></h3>');
  });
  it('Works with free text', function() {
    var html = 'Text one<img src="/test.jpg">Text two';
    var result = splitHtml(html, 'img');
    assert(result.length === 3);
    assert(result[0] === 'Text one');
    assert(result[1] === '<img src="/test.jpg">');
    assert(result[2] === 'Text two');
  });
  it('Works with multiple instances', function() {
    var html = '<h4>First component.</h4><img src="/test.jpg"><p>Second component.</p><img src="/test2.jpg"><p>Third component.</p>';
    var result = splitHtml(html, 'img');
    assert(result.length === 5);
    assert(result[0] === '<h4>First component.</h4>');
    assert(result[1] === '<img src="/test.jpg">');
    assert(result[2] === '<p>Second component.</p>');
    assert(result[3] === '<img src="/test2.jpg">');
    assert(result[4] === '<p>Third component.</p>');
  });
  it('Respects test function', function() {
    var html = '<h4>First component.</h4><a href="/button-link"><img src="/test.jpg"></a><p>Second component.</p><a href="/regular-link">Link text.</a><p>More text in second component.</p>';
    var result = splitHtml(html, 'a', function($el) {
      if ($el.find('img').length) {
        return true;
      } else {
        return false;
      }
    });
    assert(result.length === 3);
    assert(result[0] === '<h4>First component.</h4>');
    assert(result[1] === '<a href="/button-link"><img src="/test.jpg"></a>');
    assert(result[2] === '<p>Second component.</p><a href="/regular-link">Link text.</a><p>More text in second component.</p>');
  });
  it('Respects a split at the end of a word', function() {
    var html = '<p>One</p><p>Two<span data-split-marker></span></p><p>Three</p><p>Four</p>';
    var result = splitHtml(html, 'span[data-split-marker]');
    assert(result.length === 3);
    assert(result[0] === '<p>One</p><p>Two</p>');
    assert(result[1] === '<span data-split-marker></span>');
    assert(result[2] === '<p></p><p>Three</p><p>Four</p>');
  });
  it('Splits properly when parents are multiple levels deep', function() {
    var html = '<div><section><p>Hello!<span data-split-marker=""></span>Goodbye.</p></section></div>';
    var result = splitHtml(html, 'span[data-split-marker]');
    assert(result.length === 3);
    assert(result[0] === '<div><section><p>Hello!</p></section></div>');
    assert(result[1] === '<span data-split-marker></span>');
    assert(result[2] === '<div><section><p>Goodbye.</p></section></div>');
  });
});

