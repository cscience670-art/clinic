const express = require("express");
const router = express.Router();

// 🔐 Admin ثابت (بسيط للمشروع)
const ADMIN = {
  username: "admin",
  password: "1234"
};

// ======================
// LOGIN
// ======================
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN.username && password === ADMIN.password) {
    return res.json({
      success: true,
      token: "admin-token-123"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
});

module.exports = router;