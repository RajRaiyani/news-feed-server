const Joi = require('joi');

module.exports = {
  list: {
    query: Joi.object({
      limit: Joi.number().integer().min(1).max(100).default(100),
      offset: Joi.number().integer().min(0).default(0),
      tokens: Joi.array().items(
        Joi.string().lowercase().trim().min(1).max(50),
      ).default([]),
      resultCount: Joi.boolean().default(false),
    }),
  },
};
