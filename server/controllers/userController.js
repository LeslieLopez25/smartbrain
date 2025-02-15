const handleAuthUser = async (req, res, db) => {
  try {
    const { sub, email, name } = req.auth;

    let user = await db("users").where({ auth0_id: sub }).first();

    if (!user) {
      const newUser = await db("users")
        .insert({
          auth0_id: sub,
          name,
          email,
          entries: 0,
          age: null,
          pet: null,
          favorite_food: null,
          profile_image: null,
          joined: new Date(),
        })
        .returning("*");

      user = newUser[0];
    }

    res.json(user);
  } catch (error) {
    console.error("Error handling authenticated user:", error);
    res.status(500).json({ error: "Failed to fetch or initialize user" });
  }
};

module.exports = { handleAuthUser };
