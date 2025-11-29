const express = require("express");
const { body, validationResult } = require("express-validator");
const { registerUser, loginUser } = require("../services/authService.js");

const router = express.Router();

// POST /auth/register
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await registerUser(req.body);
      res.json({
        ok: true,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// POST /auth/login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { user, token } = await loginUser(req.body);
      res.json({
        ok: true,
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
