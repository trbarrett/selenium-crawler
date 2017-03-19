const startBreadthFirstSearch = require('./breadth_first_search.js');
const getPageLinksAndAssets = require('./get_page_links_and_assets.js');

function crawlDomain(startUrl, domain, maxPages) {
  const startPage = { url: startUrl, assets: [] };

  const crawlerIter = startBreadthFirstSearch(startPage,
    page => page.url //key is the url
  );

  // returns a promise, which will crawl all the pages
  // in crawlerIter up to the maxPages count
  return crawlAll(crawlerIter, domain, maxPages);
}


/**
 * Returns a promise which will iterate through all the pages,
 * and end up returning the list of crawled pages when finished
 * It's basically a reducer function on an potentially infintie
 * generator function: crawlerIter
 *
 */
function crawlAll(crawlerIter, domain, maxPages) {
  const crawledPages = [];
  const crawler = (function(page) {
    //crawl the given page
    return crawlPage(page, domain).then(linkedPages => {
      crawledPages.push(page);

      //we've hit the limit of the pages we want to visit
      if (crawledPages.length >= maxPages) {
        return crawledPages;
      }

      const nextPage = crawlerIter.next(linkedPages).value; 

      //We've run out of pages to visit
      if (!nextPage) {
        return crawledPages;
      }

      //continue crawling
      return crawler(nextPage);
    });
  });

  return crawler(crawlerIter.next().value);
}


/**
 * Returns a promise, that will load all the links and assets for
 * the page, set the asssets on the page object, and return the
 * resolve to the linked pages if any
 */
function crawlPage(page, domain) {
  return getPageLinksAndAssets(page.url, domain).then(([links, assets]) => {
    page.assets = assets; //set the assest for the page
    // map each link into an actual page object that we want to visit
    // in the future
    const linkedPages = links.map(l => ({ url: l, assets: [] }));
    return linkedPages;
  });
}


module.exports = crawlDomain;
