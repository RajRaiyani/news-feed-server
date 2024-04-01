const { Pool } = require('pg');

const { database } = require('./var');

const dbConfig = {
  user: database.user,
  password: database.password,
  host: database.host,
  database: database.database,
  port: database.port,
  max: 80,
  ssl: {
    rejectUnauthorized: false,
  },
  // number of milliseconds to wait before timing out when connecting a new client
  // by default this is 0 which means no timeout
  // return an error after specified milliseconds if connection could not be established
  connectionTimeoutMillis: 30000, // i.e. "connect_timeout" // (30 seconds X 1000 milliseconds)

  // max milliseconds a client can go unused before it is removed from the pool and destroyed
  idleTimeoutMillis: 900000, // (15 minutes X 60 seconds X 1000 milliseconds)

  // max milliseconds any query using this connection will execute for before timing out in error.
  // false=unlimited
  statement_timeout: 30000, // (30 seconds X 1000 milliseconds)

  // max miliseconds to wait for query to complete (client side)
  query_timeout: 30000, // (30 seconds X 1000 milliseconds)
};

const pool = new Pool(dbConfig);

module.exports = {
  pool,
};
