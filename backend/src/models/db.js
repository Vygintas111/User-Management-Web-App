const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "mysql",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "secretpassword",
  database: process.env.DB_NAME || "user_management",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");

  connection.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) throw err;
    console.log("Test query result: ", results[0].solution);
  });
});

module.exports = connection;
