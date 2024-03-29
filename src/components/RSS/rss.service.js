const axios = require('axios');
const xmljs = require('xml2js');
const { rss } = require('../../config/constant');

function convertDescriptionToJSON(description) {
  const list = [];
  const expression = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>([^<]*)<\/li>/g;

  let match = expression.exec(description);
  while (match !== null) {
    list.push({ link: match[1], title: match[2].trim(), publisher: match[3].trim() });
    match = expression.exec(description);
  }
  return list;
}

exports.fetchFeeds = async (countryTag) => {
  const url = `${rss.googleNews}?gl=${countryTag}`;
  const response = await axios.get(url);
  const { items } = response.data;

  const data = await xmljs.parseStringPromise(response.data, { encoding: 'utf-8' }).then((result) => result.rss.channel[0]);

  if (!data || !data.items) return [];

  const feeds = data.items.map((item) => {
    const arr = convertDescriptionToJSON(item.description[0]);
    return { ...item, description: arr };
  });

  return feeds;
};
