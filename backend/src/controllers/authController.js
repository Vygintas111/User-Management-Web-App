const db = require("../models/db");

const register = (req, res) => {
  const { name, email, password } = req.body;
  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], (err, results) => {
    if (err) {
      console.log("Database error: ", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(500).json({ error: "Email already exists" });
      }
      return res
        .status(500)
        .json({ error: "An error occured during registration" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "An error occured during login" });
    }

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
  });
};

module.exports = { register, login };
