const DB = require('../../config/database');
const dal = require('./feed.dal');

exports.upsert = async (feed) => {
  const dbClient = await DB.pool.connect();
  try {
    return await dal.upsert(dbClient, feed);
  } finally {
    dbClient.release();
  }
};

exports.list = async (limit, offset, tokens, resultCount = false) => {
  const dbClient = await DB.pool.connect();
  const promiseArray = [];
  try {
    promiseArray.push(dal.list(dbClient, limit, offset, tokens));
    if (resultCount) promiseArray.push(dal.getResultCount(dbClient, tokens));
    const [list, count] = await Promise.all(promiseArray);
    return { list, count: count ?? undefined };
  } finally {
    dbClient.release();
  }
};
