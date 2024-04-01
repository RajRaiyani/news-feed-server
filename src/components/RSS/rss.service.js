const axios = require('axios');
const xml2js = require('xml2js');
const { rss } = require('../../config/constant');

exports.fetchFeeds = async (countryTag) => {
  const url = `${rss.googleNews}?gl=${countryTag}`;
  const response = await axios.get(url);

  const data = await xml2js.parseStringPromise(response.data, { encoding: 'utf-8' }).then((result) => result.rss.channel[0]);

  if (!data || !data.item) return [];

  const feeds = data.item.map((feed) => ({ title: feed.title[0], link: feed.link[0], pubDate: feed.pubDate[0], description: feed.description[0], source: feed.source[0]?._ }));

  return feeds;
};
