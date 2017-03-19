const Promise = require('bluebird');
const webdriver = require('selenium-webdriver');
const By = webdriver.By;

function getPageLinksAndAssets(url, domain) {

  // connect to selenium.
  // NOTE: hard coded for this project, ideally this would live in a config file
  //       and/or potentially be injected into the method
  const driver = new webdriver.Builder().
    forBrowser('chrome').
    usingServer('http://selenium:4444/wd/hub').build();

  // load the page via selenium
  driver.get(url);

  //debugging statement
  console.log(`scanning ${url}  ...`);

  const getLinks = getPageLinks(driver, domain);
  const getAssets = getPageAssets(driver, domain);
  return Promise.all([getLinks, getAssets]).then(result => {
    // we've finished with the page, so exit the driver
    driver.quit();
    return result;
  });
}

function getPageLinks(driver, domain) {
  // I consider both http or https links within the domain to be fair game
  // NOTE: selenium is making this easier by converting all relative paths
  //       to absolute paths before we get them
  const internalLinkRegexp = new RegExp("^https?://" + domain);

  const getStandardLinks = attrValueFinder(driver,
    //all 'anchor' tags that aren't set to "no follow"
    'a[href]:not([rel="no-follow"])', 
    [],
    'href',
    [x => internalLinkRegexp.test(x)]);

  const getIframePages = attrValueFinder(driver,
    'iframe[src]',
    [],
    'src',
    [x => internalLinkRegexp.test(x)]);

  return Promise.join(getStandardLinks, getIframePages, 
    (standardLinks, iframePages) =>
      standardLinks.concat(iframePages));
}

function getPageAssets(driver, domain) {
  const getStandardAssets = attrValueFinder(driver,
    '[src]',
    // filter out elements with a tag of 'iframe'.
    // I'm considering those to be page links (see above)
    [(e) => e.getTagName().then(tn => tn !== 'iframe')],
    'src',
    []);

  const getLinkAssets = attrValueFinder(driver,
    'link[href][rel="icon"], link[href][rel="stylesheet"]',
    [],
    'href',
    []);

  return Promise.join(getStandardAssets, getLinkAssets, 
    (standardAssets, linkAssets) =>
      standardAssets.concat(linkAssets));
}

/**
 * Returns a promise, that will find all the matching attribute
 * values in a page.
 * This is where all the selenium goodness lives
 * @param {object} driver - the selenium web driver setup for the current page
 * @param {string} elementCssSelector - css selector to select the elements we want
 * @param {array} elementFilters - array of element filters, each which takes the
 *   element and returns a Promise to a bool
 * @param {string} attributeName - attribute on the elements we are looking for
 * @param {array} attributeFilters - filters out attributes values we're not interseted
 *   in. Takes a string and returns a bool. No promises for this one
 */
function attrValueFinder(driver, elementCssSelector, elementFilters, attributeName, attributeFilters) {
  return driver.findElements(webdriver.By.css(elementCssSelector)
  ).then(elements => {
    // run a filter on the elements
    // NOTE: this is a bit of a pain, becuase our filters are promises,
    //       as are their results. Thank goodness for bluebird
    return Promise.filter((elements || []), e => {
      return Promise.reduce((elementFilters || []), 
        (acc, filter) => acc && filter(e),
      true);
    });
  }).then(elements => {
    return Promise.all(elements.map(e => e.getAttribute(attributeName)));
  }).then(attrValues => {
    //apply all the attribute filters we have, if any
    const vals = (attributeFilters || [])
      .reduce((vals, filter) => vals.filter(filter), attrValues)
    return vals;
  });
}



module.exports = getPageLinksAndAssets;
