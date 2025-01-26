const db = require("../models/db");

const checkAuth = (req, res, next) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = results[0];
    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ error: "User is blocked. Next action redirect to login..." });
    }

    next();
  });
};

module.exports = checkAuth;
