const express = require("express");
const { getUsers, handleUserAction } = require("../controllers/userController");
const checkAuth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", checkAuth, getUsers);
router.post("/action", checkAuth, handleUserAction);

module.exports = router;
