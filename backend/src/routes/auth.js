const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

// router.post("/register", (req, res) => {
//   console.log("Incoming Request URL:", req.originalUrl); // Log the request URL
//   console.log("Request Method:", req.method); // Log the request method
//   console.log("Request Headers:", req.headers); // Log the request headers
//   register(req, res);
// });

// router.post("/login", (req, res) => {
//   console.log("Incoming Request URL:", req.originalUrl); // Log the request URL
//   console.log("Request Method:", req.method); // Log the request method
//   console.log("Request Headers:", req.headers); // Log the request headers
//   login(req, res);
// });

router.post("/register", register);
router.post("/login", login);

module.exports = router;
