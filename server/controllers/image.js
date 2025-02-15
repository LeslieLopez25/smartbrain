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

const handleImage = async (req, res, db) => {
  const { auth0_id } = req.body;

  if (!auth0_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updatedUser = await db("users")
      .where({ auth0_id })
      .increment("entries", 1)
      .returning("entries");

    if (updatedUser.length) {
      res.json({ entries: updatedUser[0].entries });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating entries:", error);
    res.status(500).json({ error: "Failed to update entries" });
  }
};

module.exports = {
  handleImage,
  handleApiCall,
};
