const express = require('express');

const router = express.Router();

const feedRoute = require('./feed/feed.route');

router.use('/feeds', feedRoute);

module.exports = router;
