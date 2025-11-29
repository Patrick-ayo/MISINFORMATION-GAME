// server/config/db.js
const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    // keep it simple — modern mongoose handles options internally
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connect error:", err);
    process.exit(1);
  }
}

module.exports = { connectDB };
