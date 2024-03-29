/* eslint-disable no-await-in-loop */
const rssService = require('../components/RSS/rss.service');
const feedService = require('../components/feed/feed.service');

async function fetchFeeds() {
  const countryTags = ['US', 'IN', 'IT', 'NZ', 'AU', 'SG'];
  const feeds = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const countryTag of countryTags) {
    const items = await rssService.fetchFeeds(countryTag);
    console.log('countryTags:', countryTag);
    feeds.push(...items);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const feed of feeds) {
    await feedService.upsert(feed);
  }
  console.log('feeds inserted successfully!');
  return feeds;
}

module.exports = fetchFeeds;
