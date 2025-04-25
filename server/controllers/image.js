const Clarifai = require("clarifai");
require("dotenv").config();

const app = new Clarifai.App({
  // Use your own Clarifai API key
  apiKey: process.env.API_CLARIFAI,
});

// Handles a call to the Clarifai API for face detection
const handleApiCall = (req, res) => {
  app.models
    .predict("face-detection", req.body.input)
    .then((data) => {
      res.json(data); // Send Clarifai response back to the frontend
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

// Handles updating the user's image submission count in the database
const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries); // Send updated count back to frontend
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
