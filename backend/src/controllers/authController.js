const pool = require("../models/db");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const connection = await pool.getConnection();

    const [emailCheckResults] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (emailCheckResults.length > 0) {
      connection.release();
      return res.status(400).json({ error: "Email already exists" });
    }

    const [insertResults] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    connection.release();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Database error during registration: ", err);

    if (connection) {
      connection.release();
    }

    res.status(500).json({ error: "An error occurred during registration" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();

    const [results] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    connection.release();

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Your email or password is incorrect" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res
        .status(401)
        .json({ error: "Your email or password is incorrect" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ error: "User is blocked" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Database error during login: ", err);

    if (connection) {
      connection.release();
    }

    res.status(500).json({ error: "An error occurred during login" });
  }
};

module.exports = { register, login };
