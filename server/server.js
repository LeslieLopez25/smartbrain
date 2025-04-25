require("dotenv").config();
const express = require("express");
const cors = require("cors");
const knex = require("knex");

const profile = require("./controllers/profile");
const image = require("./controllers/image");
const { handleAuth } = require("./controllers/auth");

// Connect to PostgreSQL database using knex
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true, // Enable SSL for secure connection
  },
});

const app = express();

// CORS settings to allow specific frontend origins
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Face recognition backend is running");
});

// Get a user profile by user ID
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// Get a user by their Auth0 ID (used on login to fetch user info)
app.get("/users/:auth0_id", (req, res) => {
  const { auth0_id } = req.params;
  db("users")
    .where({ auth0_id })
    .first()
    .then((u) =>
      u ? res.json(u) : res.status(404).json({ error: "User not found" })
    )
    .catch((err) => {
      res.status(500).json({ error: "Error fetching user" });
    });
});

// Update user profile information
app.post("/profile/:id", (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

// Increment user's entries when a new image is submitted
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// Send image URL to Clarifai API to get face detection data
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

// Handle saving a user from Auth0 to the database
app.post("/auth", (req, res) => handleAuth(req, res, db));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
