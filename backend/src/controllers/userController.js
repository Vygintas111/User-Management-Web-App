const pool = require("../models/db");

const getUsers = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query("SELECT * FROM users");
    connection.release();
    res.status(200).json(results);
  } catch (err) {
    console.error("Database error: ", err);
    res.status(500).json({ error: "Database error" });
  }
};

const handleUserAction = async (req, res) => {
  const { action, userIds } = req.body;

  try {
    const connection = await pool.getConnection();

    let query;
    if (action === "block") {
      query = 'UPDATE users SET status = "blocked" WHERE id IN (?)';
    } else if (action === "unblock") {
      query = 'UPDATE users SET status = "active" WHERE id IN (?)';
    } else if (action === "delete") {
      query = "DELETE FROM users WHERE id IN (?)";
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await connection.query(query, [userIds]);
    connection.release();

    res.status(200).json({ message: "Action performed successfully" });
  } catch (err) {
    console.error("Database error: ", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getUsers, handleUserAction };
