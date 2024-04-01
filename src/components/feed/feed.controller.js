const FeedService = require('./feed.service');

exports.list = async (req, res) => {
  const { limit, offset, tokens } = req.query;
  const feeds = await FeedService.list(limit, offset, tokens);
  res.json(feeds);
};
