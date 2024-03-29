const { Parameter } = require('../../lib/query-builder');

exports.upsert = async (dbClient, feed) => {
  const { title, pubDate, content } = feed;
  const pm = new Parameter();

  const sqlStmtForFeed = 'INSERT INTO "feed" ("title","publishedAt","document") VALUES ($1, $2, $3) on conflict do nothing returning "id";';
  const document = content.reduce((res, val) => `${res}${val.title}`, '');
  const feedParams = [title, pubDate, document];

  try {
    await dbClient.query('BEGIN');

    const res = await dbClient.query(sqlStmtForFeed, feedParams);
    const feedId = res.rows[0]?.id;

    if (!feedId) return;

    const articleList = content.map((article) => `(${pm.di(feedId, 'feedId')},${pm.di(article.title)},${pm.di(article.link)},${pm.di(article.publisher)})`);
    if (!articleList.length) return;
    const sqlStmtForArticle = `INSERT INTO "article" ("feedId","title","link","publisher") VALUES ${articleList.join(',')} on conflict do nothing`;

    await dbClient.query(sqlStmtForArticle, pm.values);

    await dbClient.query('COMMIT');
  } catch (error) {
    await dbClient.query('ROLLBACK');
    throw error;
  }
};
