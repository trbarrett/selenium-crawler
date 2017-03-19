const mocha = require('mocha');
const chai = require('chai');
const mockRequire = require('mock-require');
const getPageLinksAndAssets = require('../src/get_page_links_and_assets.js');
let crawlDomain = require('../src/crawler.js');
const should = chai.should();

// mock out the page retrival for this test
// It will be the same for all pages but that should be ok. We could use something like sinon.js
// if we wanted to do more advanced mocking
mockRequire('../src/get_page_links_and_assets.js', function() {
  return Promise.resolve([['http://foobar.com/page1', 'http://foobar.com/page2'], ['a.jpg','b.css']]);
});
// we need to reload crawler.js so get_page_links_and_assets.js is mocked correctly
crawlDomain = mockRequire.reRequire('../src/crawler.js');


describe("domain crawler", function() {

  it('should crawl start page only when max = 1', function(done) {
    crawlDomain('http://foobar.com/startPage', 'http://foobar.com/', 1).then(crawledPages => {
      crawledPages[0].url.should.equal('http://foobar.com/startPage');
      crawledPages[0].assets[0].should.equal('a.jpg');
      crawledPages[0].assets[1].should.equal('b.css');
      crawledPages[0].assets.length.should.equal(2);
      crawledPages.length.should.equal(1);
      done();
    });
  });

  it('should crawl 2 pages only when max = 2', function(done) {
    crawlDomain('http://foobar.com/startPage', 'http://foobar.com/', 2).then(crawledPages => {
      crawledPages[0].url.should.equal('http://foobar.com/startPage');
      crawledPages[0].assets[0].should.equal('a.jpg');
      crawledPages[0].assets[1].should.equal('b.css');
      crawledPages[0].assets.length.should.equal(2);

      crawledPages[1].url.should.equal('http://foobar.com/page1');
      crawledPages[1].assets[0].should.equal('a.jpg');
      crawledPages[1].assets[1].should.equal('b.css');
      crawledPages[1].assets.length.should.equal(2);

      crawledPages.length.should.equal(2);
      done();
    });
  });

  it('should crawl all pages', function(done) {
    crawlDomain('http://foobar.com/startPage', 'http://foobar.com/', 10).then(crawledPages => {
      crawledPages[0].url.should.equal('http://foobar.com/startPage');
      crawledPages[0].assets[0].should.equal('a.jpg');
      crawledPages[0].assets[1].should.equal('b.css');
      crawledPages[0].assets.length.should.equal(2);

      crawledPages[1].url.should.equal('http://foobar.com/page1');
      crawledPages[1].assets[0].should.equal('a.jpg');
      crawledPages[1].assets[1].should.equal('b.css');
      crawledPages[1].assets.length.should.equal(2);

      crawledPages[2].url.should.equal('http://foobar.com/page2');
      crawledPages[2].assets[0].should.equal('a.jpg');
      crawledPages[2].assets[1].should.equal('b.css');
      crawledPages[2].assets.length.should.equal(2);

      crawledPages.length.should.equal(3);
      done();
    });
  });
});


