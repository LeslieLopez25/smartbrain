const db = require("../db");

const handleAuthUser = async (req, res) => {
  try {
    const { sub, email, name } = req.auth;

    // Check if user exists
    const existingUser = await db("users").where("auth0_id", sub).first();

    if (existingUser) {
      return res.json(existingUser);
    }

    const newUser = await db("users")
      .insert({
        auth0_id: sub,
        email,
        name,
        joined: new Date(),
      })
      .returning("*");

    res.json(newUser[0]);
  } catch (error) {
    console.error("Error handling user:", error);
    res.status(500).json({ error: "Failed to fetch or create user" });
  }
};

module.exports = { handleAuthUser };
