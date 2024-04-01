/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { rss } = require('../../config/constant');
const { Parameter } = require('../../lib/query-builder');

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

async function getFeeds() {
  const url = `${rss.readerUrl}?rss_url=${rss.googleNews}`;
  const promiseArray = [];
  promiseArray.push(fetch(`${url}?gl=US`).then((response) => response.json()));
  promiseArray.push(fetch(`${url}?gl=IN`).then((response) => response.json()));
  promiseArray.push(fetch(`${url}?gl=IT`).then((response) => response.json()));
  promiseArray.push(fetch(`${url}?gl=NZ`).then((response) => response.json()));
  promiseArray.push(fetch(`${url}?gl=AU`).then((response) => response.json()));
  promiseArray.push(fetch(`${url}?gl=SG`).then((response) => response.json()));
  const result = await Promise.all(promiseArray);
  const items = result.reduce((acc, val) => acc.concat(val.items), []);

  items.forEach((item) => {
    const list = convertDescriptionToJSON(item.content);
    return { ...item, content: list };
  });

  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return items;
}

async function insertFeeds(dbClient, feeds) {
  for (const feed of feeds) {
    const { title, pubDate, content } = feed;

    const document = content.reduce((res, val) => `${res}${val.title}`, '');

    const sqlStmtForFeed = 'INSERT INTO "feeds" ("title","publishedAt","document") VALUES ($1, $2, $3) on conflict do nothing returning id';
    const feedParams = [title, pubDate, document];

    const pm = new Parameter();
    const articleList = content.map((article) => `(${pm.di(article.title)},${pm.di(article.link)},${pm.di(article.publisher)})`);
    const sqlStmtForArticle = `INSERT INTO "article" ("title","link","publisher") VALUES ${articleList.join(',')}`;

    try {
      await dbClient.query('BEGIN');
      await Promise.all([
        await dbClient.query(sqlStmtForFeed, feedParams),
        await dbClient.query(sqlStmtForArticle, pm.values),
      ]);
      await dbClient.query('COMMIT');
    } catch (error) {
      await dbClient.query('ROLLBACK');
      throw error;
    }
  }
}

module.exports = {
  getFeeds,
  insertFeeds,
};
