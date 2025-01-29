const pool = require("../models/db");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Register Request Body:", req.body);

    // Acquire a connection from the pool
    const connection = await pool.promise().getConnection();

    // Execute the query
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await connection.query(query, [name, email, password]);

    // Release the connection back to the pool
    connection.release();

    console.log("Registration successful");
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Database error during registration: ", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Login Request Body:", req.body);

    // Acquire a connection from the pool
    const connection = await pool.promise().getConnection();

    // Execute the query
    const [results] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // Release the connection back to the pool
    connection.release();

    if (results.length === 0) {
      console.log("Login failed: Email not found");
      return res
        .status(401)
        .json({ error: "Your email or password is incorrect" });
    }

    const user = results[0];

    if (user.password !== password) {
      console.log("Login failed: Incorrect password");
      return res
        .status(401)
        .json({ error: "Your email or password is incorrect" });
    }

    if (user.status === "blocked") {
      console.log("Login failed: User is blocked");
      return res.status(403).json({ error: "User is blocked" });
    }

    console.log("Login successful:", user);
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Database error during login: ", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

module.exports = { register, login };
