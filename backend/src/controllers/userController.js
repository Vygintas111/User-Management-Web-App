const db = require("../models/db");

const getUsers = (req, res) => {
  const query = "SELECT * FROM users ORDER BY last_login_time DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
};

const handleUserAction = (req, res) => {
  const { action, userIds } = req.body;
  const currentUserId = req.headers["user-id"];

  if (!action || !userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  let query;
  if (action === "block") {
    query = 'UPDATE users SET status = "blocked"  WHERE id IN (?)';
  } else if (action === "unblock") {
    query = 'UPDATE users SET status = "active"  WHERE id IN (?)';
  } else if (action === "delete") {
    query = "DELETE FROM users WHERE id IN (?)";
  } else {
    return res.status(400).json({ error: "Invalid action" });
  }

  console.log("Query", query);
  console.log("User IDs: ", userIds);

  db.query(query, [userIds], (err, results) => {
    if (err) {
      console.error("Database error: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (userIds.includes(Number(currentUserId)) && action !== "delete") {
      return res.status(200).json({ message: "Action performed successfully" });
    }

    if (userIds.includes(Number(currentUserId)) && action === "delete") {
      return res.status(200).json({
        message: "User deleted. Redirecting to login...",
        redirectToLogin: true,
      });
    }

    res.status(200).json({ message: "Action performed successfully" });
  });
};

module.exports = { getUsers, handleUserAction };
