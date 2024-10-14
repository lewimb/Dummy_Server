const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB_DATABASE ?? "dev",
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_USER ?? "postgres",
  port: process.env.DB_PORT ?? "5432",
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

let client;

module.exports = {
  getPoolClient: async () => {
    if (!client) {
      client = await pool.connect();
    }

    return client;
  },
};
