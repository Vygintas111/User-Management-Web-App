const db = require("../models/db");

const checkAuth = async (req, res, next) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [results] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = results[0];
    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ error: "User is blocked. Next action redirect to login..." });
    }

    next();
  } catch (err) {
    console.error("Database error in auth middleware:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

//   const query = "SELECT * FROM users WHERE id = ?";
//   db.query(query, [userId], (err, results) => {
//     if (err || results.length === 0) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const user = results[0];
//     if (user.status === "blocked") {
//       return res
//         .status(403)
//         .json({ error: "User is blocked. Next action redirect to login..." });
//     }

//     next();
//   });
// };

module.exports = checkAuth;
