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

const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send(db.users);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post("/profile/:id", (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.post("/auth", (req, res) => handleAuth(req, res, db));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
