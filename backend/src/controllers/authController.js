const db = require("../models/db");

const register = (req, res) => {
  const { name, email, password } = req.body;

  console.log("Register Request Body:", req.body); // Log the request body

  const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(query, [name, email, password], (err, results) => {
    if (err) {
      console.error("Database error during registration: ", err); // Log the request body
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(500).json({ error: "Email already exists" });
      }
      return res
        .status(500)
        .json({ error: "An error occured during registration" });
    }
    console.log("Registration successful: ", results); // Log successful registration
    res.status(201).json({ message: "User registered successfully" });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  console.log("Login Request Body:", req.body); // Log the request body

  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Database error during login: ", err); // Log database errors
      return res.status(500).json({ error: "An error occured during login" });
    }

    if (results.length === 0) {
      console.log("Login failed: Email not found"); // Log email not found
      return res
        .status(401)
        .json({ error: "Your email or password is incorrect" });
    }

    const user = results[0];

    if (user.password !== password) {
      console.log("Login failed: Incorrect password"); // Log incorrect password
      return res
        .status(401)
        .json({ error: "Your email or password is incorrect" });
    }

    if (user.status === "blocked") {
      console.log("Login failed: User is blocked"); // Log blocked user
      return res.status(403).json({ error: "User is blocked" });
    }
    console.log("Login successful:", user); // Log successful login
    res.status(200).json({ message: "Login successful", user });
  });
};

module.exports = { register, login };
