const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return await User.create({ name, email, password: hash });
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid credentials");

  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return { user, token };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
};
