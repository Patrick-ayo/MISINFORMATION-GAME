const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const factCheckRoutes = require("./routes/factCheckRoutes.js");
const chatbot = require("./routes/chatbot");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.use(express.static("public"));

// Chatbot API Route
app.use("/chatbot", chatbot);

// Fact Check API Route
app.use("/fact", factCheckRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
