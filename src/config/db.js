const mysql = require("mysql2/promise");
const env = require("./env");

const pool = mysql.createPool(env.db);

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getConnection() {
  return pool.getConnection();
}

module.exports = { pool, query, getConnection };
