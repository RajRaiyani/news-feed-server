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

exports.list = async (limit, offset, tokens) => {
  const dbClient = await DB.pool.connect();
  try {
    return await dal.list(dbClient, limit, offset, tokens);
  } finally {
    dbClient.release();
  }
};
