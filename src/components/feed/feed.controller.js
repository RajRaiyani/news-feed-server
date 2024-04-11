const FeedService = require('./feed.service');

exports.list = async (req, res) => {
  const { limit, offset, tokens, resultCount } = req.query;
  const feeds = await FeedService.list(limit, offset, tokens, resultCount);
  res.json(feeds);
};
