const express = require("express");
const cors = require("cors");
const knex = require("knex");
const { checkJwt } = require("./auth");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/profile", checkJwt, (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/profile", checkJwt, (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

app.put("/image", checkJwt, (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", checkJwt, (req, res) => {
  image.handleApiCall(req, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
