const Clarifai = require("clarifai");
const axios = require("axios");

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

const handleImage = async (req, res) => {
  const { auth0_id } = req.body;

  if (!auth0_id) {
    return res.status(400).json("User ID is required");
  }

  try {
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const managementToken = process.env.AUTH0_MANAGEMENT_TOKEN;

    if (!managementToken) {
      return res.status(500).json({ error: "Missing Auth0 Management Token" });
    }

    // Get current metadata
    const userUrl = `https://${auth0Domain}/api/v2/users/${auth0_id}`;
    const headers = {
      Authorization: `Bearer ${managementToken}`,
      "Content-Type": "application/json",
    };

    const userResponse = await axios.get(userUrl, { headers });
    let userMetadata = userResponse.data.user_metadata || {};

    // Increment entries
    userMetadata.entries = (userMetadata.entries || 0) + 1;

    // Update metadata in Auth0
    await axios.patch(userUrl, { user_metadata: userMetadata }, { headers });

    res.json({ entries: userMetadata.entries });
  } catch (error) {
    console.error("Error updating user entries:", error);
    res.status(500).json({ error: "Failed to update entries" });
  }
};

module.exports = {
  handleImage,
  handleApiCall,
};
