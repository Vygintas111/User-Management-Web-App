const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "secretpassword",
  database: process.env.DB_NAME || "user_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
