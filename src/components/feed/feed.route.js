const express = require('express');
const FeedController = require('./feed.controller');
const { validate } = require('../../util/validationHelper');
const FeedValidation = require('./feed.validation');

const router = express.Router();

router.get('/', validate(FeedValidation.list), FeedController.list);

module.exports = router;
