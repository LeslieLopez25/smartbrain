// Function to handle saving or retrieving Auth0 user in the database
const handleAuth = async (req, res, db) => {
  const { auth0_id, name, email } = req.body;

  // Validate request body
  if (!auth0_id || !email) {
    return res.status(400).json({ error: "Missing required Auth0 data" });
  }

  try {
    // Check if user already exists
    const existingUser = await db("users").where({ auth0_id }).first();
    if (existingUser) {
      return res.json(existingUser);
    }

    // If not, insert new user in to DB
    const newUserArray = await db("users")
      .insert({
        auth0_id,
        name,
        email,
        joined: new Date(),
        profile_image: "", // Default empty profile image
      })
      .returning("*"); // Return all columns of the new user

    return res.json(newUserArray[0]); // Send back the new user
  } catch (error) {
    console.error("Error saving Auth0 user:", error);
    return res.status(500).json({ error: "Failed to save user" });
  }
};

module.exports = {
  handleAuth,
};
