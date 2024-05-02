// Configuration
require('dotenv').config({ path: '.env', override: true });

// Other imports
const http = require('http');
const vars = require('./config/var');
const app = require('./app');
const Logger = require('./lib/logger');
const CronJobs = require('./cron');

const server = http.createServer(app);

// const fetchFeeds = require('./script/fetchFeeds');
// fetchFeeds();

// Cron Jobs >>>
CronJobs.FetchFeeds.start();
// <<<

const { port, env } = vars;

Logger.info(`ENV : ${env}`);

server.listen(port, () => {
  Logger.info(`Server PORT : ${port}`);
});

module.exports = app;
