const handleAuth = async (req, res, db) => {
  const { auth0_id, name, email } = req.body;

  if (!auth0_id || !email) {
    return res.status(400).json({ error: "Missing required Auth0 data" });
  }

  try {
    const existingUser = await db("users").where({ auth0_id }).first();
    if (existingUser) {
      return res.json(existingUser);
    }

    const newUserArray = await db("users")
      .insert({
        auth0_id,
        name,
        email,
        joined: new Date(),
        profile_image: "",
      })
      .returning("*");

    return res.json(newUserArray[0]);
  } catch (error) {
    console.error("Error saving Auth0 user:", error);
    return res.status(500).json({ error: "Failed to save user" });
  }
};

module.exports = {
  handleAuth,
};
