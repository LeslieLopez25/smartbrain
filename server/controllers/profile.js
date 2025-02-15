const handleProfile = async (req, res, db) => {
  const { name, email, sub } = req.body;

  if (!email || !sub) {
    return res.status(400).json("Missing required fields");
  }

  try {
    const existingUser = await db("users").where({ auth0_id: sub }).first();

    if (!existingUser) {
      const newUser = await db("users")
        .insert({
          name,
          email,
          auth0_id: sub,
          entries: 0,
          age: null,
          pet: null,
          favorite_food: null,
          profile_image: null,
          joined: new Date(),
        })
        .returning("*");

      return res.json(newUser[0]);
    }

    res.json(existingUser);
  } catch (err) {
    console.error("Error handling profile:", err);
    res.status(500).json("Error saving user");
  }
};

const handleProfileGet = async (req, res, db) => {
  try {
    const auth0_id = req.auth?.sub;

    if (!auth0_id) {
      return res.status(400).json("Authentication required");
    }

    const user = await db("users").where({ auth0_id }).first();

    if (user) {
      res.json(user);
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    console.error("Error retrieving user profile:", err);
    res.status(500).json("Error getting user");
  }
};

const handleProfileUpdate = async (req, res, db) => {
  const auth0_id = req.auth?.sub;
  const { name, age, pet, favorite_food, profile_image } = req.body;

  try {
    const updatedUser = await db("users")
      .where({ auth0_id })
      .update({ name, age, pet, favorite_food, profile_image })
      .returning("*");

    if (updatedUser.length) {
      res.json(updatedUser[0]);
    } else {
      res.status(404).json("Unable to update profile");
    }
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json("Error updating user");
  }
};

module.exports = {
  handleProfile,
  handleProfileGet,
  handleProfileUpdate,
};
