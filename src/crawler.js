const startBreadthFirstSearch = require('./breadth_first_search.js');
const getPageLinksAndAssets = require('./get_page_links_and_assets.js');

function crawlDomain(startUrl, domain, maxPages) {

  const startPage = { url: startUrl, assets: [] };

  const crawlerIter = startBreadthFirstSearch(startPage,
    page => page.url //key is the url
  );

  // returns a promise, which will crawl all the pages in crawlerIter up to the
  // maxPages count
  return crawlPage(
    [], //the accumulator for our reducer
    crawlerIter,
    crawlerIter.next().value,
    maxPages,
    0);
}



/**
 * Returns a promise which will iterate through all the pages,
 * and end up returning the list of crawled pages when finished
 * It's basically a reducer function on an potentially infintie
 * generator function
 *
 */
function crawlPage(
    crawledPages, //accumulator
    crawlerIter, //breadth-first-search generator function 
    page,        //current page
    maxPages,
    visitedPagesCount) {

  //we've hit the limit of the pages we want to visit
  if (visitedPagesCount >= maxPages) {
    return Promise.resolve(crawledPages);
  }
  
  //We've run out of pages to visit
  if (!page) {
    return Promise.resolve(crawledPages);
  }

  return getPageLinksAndAssets(page.url).then(([links, assets]) => {
    page.assets = assets;
    // map each link into an actual page object that we want to visit next
    const linkedPages = links.map(l => ({ url: l, assets: [] }));

    return crawlPage(
      crawledPages.concat(page),
      crawlerIter,
      // we pass the links back to the crawler so it can continue crawling
      crawlerIter.next(linkedPages).value, 
      maxPages,
      visitedPagesCount + 1
    );
  });
}


module.exports = crawlDomain;
