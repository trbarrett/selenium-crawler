var webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

var driver = new webdriver.Builder().forBrowser('chrome').usingServer('http://selenium:4444/wd/hub').build();

// The domain name should be passed in as a single argument e.g. 'www.google.com'
let domain = process.argv[2]; 

// I don't do any tests to test the domain's validity
// general node development style is to fail fast on bad input

// I handle input with or without a 'http[s]://' prefix.
// If given a specific one, I'll start the crawl with that scheme
// otherwise I'll start with http://domain
if (domain.startsWith('http')) {
  driver.get(domain);
  domain = domain.slice(domain.indexOf('://') + 3);
} else {
  driver.get('http://' + domain);
}

// I consider both http or https links within the domain to be fair game
const internalLinkRegexp = new RegExp("^https?://" + domain);

/*
//equivalent to xpath('//a[not(@rel="no-follow") and @href]')
driver.findElements(webdriver.By.css('a[href]:not([rel="no-follow"])')).then(elements => {
  elements[0].getAttribute('href').then(href => console.log(href));

  Promise.all(elements.map(e => e.getAttribute('href'))).then(hrefs => {
    //ignore links not in the domain
    const links = hrefs.filter(href => internalLinkRegexp.test(href));

    //otherwise everything is fair game
    console.log(links);
  });
});

// NOTE: For this assignment I'm considering iframes to be a 'reachable page'
// if they are within the same domain.
driver.findElements(webdriver.By.css('iframe[src]')).then(elements => {
  Promise.all(elements.map(e => e.getAttribute('src'))).then(hrefs => {
    //ignore links not in the domain
    const links = hrefs.filter(href => internalLinkRegexp.test(href));

    //otherwise everything is fair game
    console.log(links);
  });
});

//TODO rel='alternate', etc

*/


/*
driver.findElements(webdriver.By.css('[src]')).then(elements => {

  const IGNORE_ELEMENT = 'IGNORE_ELEMENT';

  //ignore iframes... this isn't so easy when everything is a promise
  return Promise.all(
    elements.map(e => {
      return e.getTagName().then(tagName => {
        if (tagName !== 'iframe') {
          console.log('tagname: ' + tagName);
          return e;
        } else {
          console.log(IGNORE_ELEMENT);
          return 'IFRAME';
        }
      });
    })
  ).then(mapedElements => {
    const nonIframes = mapedElements.filter(e => e !== IGNORE_ELEMENT);
    const attributePromisies = nonIframes.map(e => e.getAttribute('src'));
    return Promise.all(attributePromisies).then(srcs => {
      //otherwise everything is fair game
      console.log(srcs);
    });
  });
});
*/

  
driver.findElements(webdriver.By.css('link[href][rel="icon"], link[href][rel="stylesheet"]')).then(elements => {
  return Promise.all(elements.map(e => e.getAttribute('href'))).then(hrefs => {
    //otherwise everything is fair game
    console.log(hrefs);
  });
});

//finding assets...
//no need for domain restrictions

//NOTE: For this exercise I'm considering html iframes that reference html links
//      to NOT be assets. They are considered as normal links in the link
//      finding function.
/*
"src"
"link href"
*/

driver.quit();
