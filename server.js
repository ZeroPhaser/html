require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Message Schema
const messageSchema = new mongoose.Schema({
    username: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// API Routes
app.post("/messages", async (req, res) => {
    const { username, text } = req.body;
    if (!username || !text) return res.status(400).json({ error: "Missing fields" });

    const newMessage = new Message({ username, text });
    await newMessage.save();
    res.json({ message: "Message sent!" });
});

app.get("/messages", async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
