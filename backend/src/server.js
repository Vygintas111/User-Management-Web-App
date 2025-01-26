const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const checkAuth = require("./middleware/authMiddleware");

const app = express();
app.use(
  cors({
    origin: "http://test4app.codespark.lt",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", checkAuth, userRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
