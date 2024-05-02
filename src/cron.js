const cron = require('node-cron');
const fetchFeeds = require('./script/fetchFeeds');

// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *

exports.FetchFeeds = cron.schedule(
  '0 */2 * * *', // Every day at midnight
  fetchFeeds,
  { scheduled: true },
);
