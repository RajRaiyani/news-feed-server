/* eslint-disable newline-per-chained-call */
const Joi = require('joi');

const env = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.SERVER_PORT || 3007,
  serviceName: process.env.SERVICE_NAME || 'Green Code',
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  consoleLogLevel: process.env.CONSOLE_LOG_LEVEL || 'info',
  fileLogLevel: process.env.FILE_LOG_LEVEL || 'block',
};

// Define validation for all the env vars
const envSchema = Joi.object({
  env: Joi.string().required().valid('dev', 'prod'),
  port: Joi.number().required().min(1024).max(65535),
  serviceName: Joi.string().required().min(3).max(255),
  database: Joi.object({
    host: Joi.string().required().min(3).max(255),
    user: Joi.string().required().min(3).max(255),
    password: Joi.string().allow(''),
    database: Joi.string().required().min(3).max(255),
  }),
  consoleLogLevel: Joi.string().required().valid('block', 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'),
  fileLogLevel: Joi.string().required().valid('block', 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'),
});

// Validate env vars
const { error } = envSchema.validate(env);

// Throw an error if env vars are not valid
if (error) throw new Error(`ENV validation error: ${error.message}`);

// Export valid env vars
module.exports = {
  env: env.env,
  port: env.port,
  jwtSecret: env.jwtSecret,

  database: {
    host: env.database.host,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database,
  },

  loggerOptions: {
    env: env.env,
    consoleLogLevel: env.consoleLogLevel,
    fileLogLevel: env.fileLogLevel,
    appName: env.serviceName,
  },
};
