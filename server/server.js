require("dotenv").config();
const express = require("express");
const cors = require("cors");
const checkJwt = require("./auth/authMiddleware");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const { handleAuthUser } = require("./controllers/userController");

const app = express();

// Apply CORS before any route handlers
app.use(cors());

app.use(express.json());

app.options("*", cors()); // Handle preflight requests

app.get("/", (req, res) => res.send("Server is running"));
app.get("/auth/user", checkJwt, handleAuthUser);
app.get("/profile", checkJwt, (req, res) => profile.handleProfileGet(req, res));
app.put("/profile", checkJwt, (req, res) =>
  profile.handleProfileUpdate(req, res)
);
app.put("/image", checkJwt, (req, res) => image.handleImage(req, res));
app.post("/imageurl", checkJwt, (req, res) => image.handleApiCall(req, res));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
