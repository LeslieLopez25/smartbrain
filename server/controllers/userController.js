const axios = require("axios");

const handleAuthUser = async (req, res) => {
  try {
    const { sub, email, name } = req.auth;

    const auth0Domain = process.env.AUTH0_DOMAIN;
    const managementToken = process.env.AUTH0_MANAGEMENT_TOKEN;

    if (!managementToken) {
      return res.status(500).json({ error: "Missing Auth0 Management Token" });
    }

    const userUrl = `https://${auth0Domain}/api/v2/users/${sub}`;
    const headers = {
      Authorization: `Bearer ${managementToken}`,
      "Content-Type": "application/json",
    };

    // Fetch user from Auth0
    const userResponse = await axios.get(userUrl, { headers });
    let userMetadata = userResponse.data.user_metadata || {};

    // ✅ Initialize entries if missing
    if (userMetadata.entries === undefined) {
      userMetadata.entries = 0;

      // 🔄 Update user metadata in Auth0
      await axios.patch(userUrl, { user_metadata: userMetadata }, { headers });
    }

    res.json({
      auth0_id: sub,
      email,
      name,
      entries: userMetadata.entries,
    });
  } catch (error) {
    console.error("Error fetching/updating user in Auth0:", error);
    res.status(500).json({ error: "Failed to fetch or initialize user" });
  }
};

module.exports = { handleAuthUser };
