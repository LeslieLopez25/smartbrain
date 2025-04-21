require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const profile = require("./controllers/profile");
const image = require("./controllers/image");
const { handleAuth } = require("./controllers/auth");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(cors());
app.use(express.json());

// server.js
// … your requires, knex setup, cors, express.json, etc.

app.use((req, res, next) => {
  console.log(`➡️ [${req.method}] ${req.url}`, req.body);
  next();
});

app.get("/", (req, res) => {
  res.send(db.users);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// server.js
app.get("/users/:auth0_id", (req, res) => {
  const { auth0_id } = req.params;
  console.log("🔍 Incoming auth0_id:", auth0_id);
  db("users")
    .where({ auth0_id })
    .first()
    .then((u) =>
      u ? res.json(u) : res.status(404).json({ error: "User not found" })
    )
    .catch((err) => {
      console.error("🔥 Error fetching user:", err);
      res.status(500).json({ error: "Error fetching user" });
    });
});

app.post("/profile/test", (req, res) => {
  console.log("✅ Reached /profile/test");
  res.json({ success: true, body: req.body });
});

app.post("/profile/:id", (req, res) => {
  console.log("➡️ POST /profile/:id hit!");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  profile.handleProfileUpdate(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.post("/auth", (req, res) => handleAuth(req, res, db));

app.use((req, res) => {
  console.log("⚠️  Unknown route hit:", req.method, req.url);
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
