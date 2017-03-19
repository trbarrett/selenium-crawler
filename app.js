const crawlDomain = require('./src/crawler.js');
const util = require('util');

// Stop after visting MAX_PAGES
let MAX_PAGES = 50;

// The domain name should be passed in as a single argument e.g. 'www.google.com'
let domain = process.argv[2]; 

// Optional max pages
let new_max = process.argv[3]; 
if (!isNaN(parseInt(new_max, 10))) {
  MAX_PAGES = parseInt(new_max, 10);
}

//normalize the trailing /
if (!domain.endsWith('/')) {
  domain = domain + '/'
}

let startUrl = domain;

// I don't do any tests to test the domain's validity
// general node development style is to fail fast on bad input

// I handle input with or without a 'http[s]://' prefix.
// If given a specific one, I'll start the crawl with that scheme
// otherwise I'll start with http://domain
if (domain.startsWith('http')) {
  domain = domain.slice(domain.indexOf('://') + 3);
} else {
  startUrl = 'http://' + domain;
}

// Crawl the domain from the start page within the domain
crawlDomain(startUrl, domain, MAX_PAGES).then(crawledPages => {
  // output the results to STDOUT in json
  console.log(util.inspect(crawledPages));
});

