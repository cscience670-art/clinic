const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "clinic",
  password: "sadek2025",
  port: 5432,
});

module.exports = pool;