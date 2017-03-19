# Selenium-Crawler

A very simple webcrawler project that uses selenium for 'HTML parsing and making requests'.

## Installation & Usage

### 1. Download this repo

### 2. Download and install docker and docker-compose 

### 3. Run it

```
  docker-compose run web-crawler node app.js www.google.co.uk
```

By default, it will hit a max of 50 urls within the given domain. Append a number to the command to define a different limit. e.g.

```
  docker-compose run web-crawler node app.js www.google.co.uk 10
```

You can also set a specific scheme (by default it uses http)

```
  docker-compose run web-crawler node app.js https://www.google.co.uk
```

It will follow links between the schemes in the same domain.

### 4. Alternatively

1. Make sure node is installed (>= 6.10)
2. Run yarn/npm install
3. Run selenium locally
4. Update the selenium settings at src/get_page_links_and_assets.js:12
5. run: node app.js www.google.co.uk


## Output

It will indicate the urls it's scanning like so:

```
  crawling http://winzip.com/ ...
  crawling http://winzip.com/about.html ...
  etc
```

then at the end dump the pages it has scanned and their assets in a json format:

```
[
  {
    "url": "http://www.example.org",
    "assets": [
      "http://www.example.org/image.jpg",
      "http://www.example.org/script.js"
    ]
  },
  {
    "url": "http://www.example.org/about",
    "assets": [
      "http://www.example.org/company_photo.jpg",
      "http://www.example.org/script.js"
    ]
  },
  ..
]
```

I added the 'crawling ' indicators because it can be quite slow waiting for selenium to render. They can be turned off by deleting the console.log statement in src/get_page_links_and_assets.js:18


## Tests

There are several mocha tests. They can be run in a docker container via:

```
  docker run selenium-crawler npm test
```

Or, if you have node setup locally, and you've run 'yarn/npm install':

```
  npm test
```

## Notes and comments

### Selenium

I choose to use selenium because:
- It would give me a more realistic version of the page, after initial javascript has run. With lots of SPAs now days I wanted to be able to fetch the page as a user would see it.
- I could do https requests out of the box without any concerns.
- I knew it was available for node without needing to look up anything else.

It has the following issues:
- It's very slow. Needing to render the whole page in a real browser, and make requests through the browser is really slow!
- The promise based model selenium exposes for any and every type of query is difficult to work with for this type of project.
- It has complicated setup.

With hindsight I would have looked for some other alternatives.

### Design

I've tried to keep it fairly functional, though in no way pure. It's certainly not an object oriented design, but given the lack of persistent state it doesn't particularly need it. Having said that it's quite modular. The breadth first search could be ripped out and replaced quite easily. Parsing and requests are well separated. Changing the crawler to perform multiple requests at once wouldn't be that difficult either. 

There are a lot of promises and one generator function (the bfs). It's not that unusual for node though. I've used bluebird in a few places where the promises got really hairy.

- src/crawler.js is responsible for the high level coordination task of reading the pages, though src/breadth_first_search.js handles the actual graph traversal.
- src/get_page_links_and_assets.js handles all of the link and asset discovery. Within that attrValueFinder does all of the selenium work.
- attrValueFinder has four phases. Requesting the elements, filtering them, finding the required attributes, then filtering those. Each of the methods to find links and assets were following that general pattern, so it made sense to abstract it.

### The Crawling

- BUG: The crawler will list the same asset multiple times if it's in the page more than once. Fix is easy enough (lodash.uniq(assets)) I simply didn't have the time.
- The crawler treats iframes as other web pages to crawl, not as assets.
- The crawler does check _link_ elements for a few asset types, but not all. It avoids checking _link_ elements for links to other pages. That can get messy fast so I decided to leave it out for the sake of time.
- The crawler considers differing _querystrings_, or _fragments_ to be different pages or assets. That's not ideal, but determining what actually constitutes a 'web page' is something I leave to a different exercise I think.

