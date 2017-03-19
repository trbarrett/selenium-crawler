const startBreadthFirstSearch = require('./breadth_first_search.js');
const getPageLinksAndAssets = require('./get_page_links_and_assets.js');

function crawlDomain(startUrl, domain, maxPages) {
  const crawledPages = [];
  const pageLinks = {};

  const startPage = { url: startUrl, assets: [] };

  const getLinkedPages = function(page) {
    //  We preload the page links at the same time that we loaded
    //  the assets to prevent duplciate requests.
    if (pageLinks[page.url]) {
      //return a new page for each link
      return pageLinks[page.url].map(link =>
        ({ url: link, assets: [] })
      );
    } else {
      return [];
    }
  }

  const crawlerIter = startBreadthFirstSearch(startPage,
    page => page.url, //key is the url
    getLinkedPages
  );

  /**
  * returns a promise which will iterate through all the pages,
  * and end up returning the list of crawled pages as long as
  * the crawlerIter is returning new pages, and maxPages hasn't
  * been met yet
  */
  function nextPage(visitedPagesCount, crawledPages) {
    if (visitedPagesCount >= maxPages) {
      return Promise.resolve(crawledPages);
    }
    
    let item = crawlerIter.next();
    if (item.done) {
      return Promise.resolve(crawledPages);
    }

    const page = item.value;
    return getPageLinksAndAssets(page.url).then(([links, assets]) => {
      pageLinks[page.url] = links;
      page.assets = assets;
      return nextPage(
        visitedPagesCount + 1,
        crawledPages.concat(page)
      );
    });
  }

  return nextPage( 0, []);
}


module.exports = crawlDomain;
