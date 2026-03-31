require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cron = require("node-cron");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

// ===== MODELS =====
const User = mongoose.model("User", {
  email: String,
  password: String,
});

const Tab = mongoose.model("Tab", {
  userId: String,
  url: String,
  title: String,
  intent: String,
  category: String,

  group: { type: String, default: "General" }, // NEW
  lastAccessed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }, // NEW

  autoClose: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
});

// ===== AUTH =====
app.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  await new User({ email: req.body.email, password: hash }).save();
  res.send("User created");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).send("Invalid password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) return res.status(401).send("No token");

    const token = header.split(" ")[1]; // extract after Bearer

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).send("Invalid token");
  }
};

app.put("/tabs/:id/group", auth, async (req, res) => {
  const tab = await Tab.findByIdAndUpdate(
    req.params.id,
    { group: req.body.group },
    { new: true },
  );
  res.json(tab);
});

// ===== SIMPLE CATEGORY RULES =====
function detectCategory(title, url) {
  const t = (title + " " + url).toLowerCase();

  if (t.includes("youtube") || t.includes("netflix")) return "Entertainment";
  if (t.includes("amazon") || t.includes("flipkart")) return "Shopping";
  if (t.includes("leetcode") || t.includes("github")) return "Coding";
  if (t.includes("docs") || t.includes("research")) return "Study";

  return "General";
}

// ===== ROUTES =====
app.post("/tabs", auth, async (req, res) => {
  const category = detectCategory(req.body.title, req.body.url);

  const tab = new Tab({
    userId: req.userId,
    url: req.body.url,
    title: req.body.title,
    intent: req.body.intent || "No intent",
    category,
  });

  await tab.save();
  res.json(tab);
});

app.get("/tabs", auth, async (req, res) => {
  const tabs = await Tab.find({ userId: req.userId });
  res.json(tabs);
});

app.put("/tabs/:id", auth, async (req, res) => {
  const tab = await Tab.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(tab);
});

app.delete("/tabs/:id", auth, async (req, res) => {
  await Tab.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// ===== ANALYTICS =====
app.get("/analytics", auth, async (req, res) => {
  const tabs = await Tab.find({ userId: req.userId });

  const total = tabs.length;
  const completed = tabs.filter((t) => t.completed).length;

  res.json({
    total,
    completed,
    productivity: total ? (completed / total) * 100 : 0,
  });
});

// ===== AUTO CLOSE LOGGER =====
cron.schedule("*/30 * * * *", async () => {
  const tabs = await Tab.find({ autoClose: true, completed: false });
  const now = new Date();

  tabs.forEach((tab) => {
    const hours = (now - tab.lastAccessed) / (1000 * 60 * 60);
    if (hours > 6) {
      console.log("Close suggestion:", tab.title);
    }
  });
});

app.listen(5000, () => console.log("Backend running on 5000"));
