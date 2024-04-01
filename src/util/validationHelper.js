const Joi = require('joi');
const { validate } = require('express-validation');

exports.validate = (schema) => validate(schema, { context: true });

exports.Schema = {
  uid: Joi.string().guid({ version: 'uuidv4' }),
};
