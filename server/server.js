require("dotenv").config();
const express = require("express");
const knex = require("knex");
const jwtCheck = require("./auth/authMiddleware");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const { handleAuthUser } = require("./controllers/userController");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://smartbrain-mtf1.onrender.com"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());

app.get("/", (req, res) => res.send("Server is running"));
app.get("/auth/user", jwtCheck, (req, res) => handleAuthUser(req, res, db));
app.get("/profile", jwtCheck, (req, res) =>
  profile.handleProfileGet(req, res, db)
);
app.put("/profile", jwtCheck, (req, res) =>
  profile.handleProfileUpdate(req, res, db)
);
app.put("/image", jwtCheck, (req, res) => image.handleImage(req, res, db));
app.post("/imageurl", jwtCheck, (req, res) => image.handleApiCall(req, res));

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
