const Clarifai = require("clarifai");

const app = new Clarifai.App({
  // Use your own Clarifai API key
  apiKey: process.env.API_CLARIFAI,
});

const handleApiCall = (req, res) => {
  app.models
    .predict("face-detection", req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { auth0_id } = req.body; // Use auth0_id

  if (!auth0_id) {
    return res.status(400).json("User ID is required");
  }

  db("users")
    .where({ auth0_id }) // Find user by auth0_id
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      if (entries.length) {
        res.json({ entries: entries[0] });
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
