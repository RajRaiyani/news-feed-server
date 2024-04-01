const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Logger = require('./lib/logger');
const appRoute = require('./components/routes');

const app = express();

app.use(morgan(':method :url Status : :status, Time taken: :response-time ms', {
  stream: {
    write: (message) => Logger.info(message),
  },
}));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route to verify if the server is running or not
app.get('/health', (req, res) => {
  res.send('ok');
});

app.use('/api/v1', appRoute);

module.exports = app;
