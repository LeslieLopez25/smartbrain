const handleProfile = async (req, res, db) => {
  const { name, email, sub } = req.body; // `sub` is the Auth0 user ID (auth0_id)

  if (!email || !sub) {
    return res.status(400).json("Missing required fields");
  }

  try {
    // Check if user already exists
    const existingUser = await db("users").where({ auth0_id: sub }).first();

    if (!existingUser) {
      // Insert new user into the database
      const newUser = await db("users")
        .insert({
          name,
          email,
          auth0_id: sub,
          entries: 0,
          joined: new Date(),
        })
        .returning("*");

      return res.json(newUser[0]);
    }

    // If user already exists, return their data
    res.json(existingUser);
  } catch (err) {
    console.error("Error handling profile:", err);
    res.status(500).json("Error saving user");
  }
};

const handleProfileGet = (req, res, db) => {
  const auth0_id = req.auth.sub;

  db.select("*")
    .from("users")
    .where({ auth0_id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch((err) => res.status(400).json("Error getting user"));
};

const handleProfileUpdate = (req, res, db) => {
  const auth0_id = req.auth.sub;
  const { name, age, pet } = req.body;

  db("users")
    .where({ auth0_id })
    .update({ name, age, pet })
    .returning("*")
    .then((updatedUser) => {
      if (updatedUser.length) {
        res.json(updatedUser[0]);
      } else {
        res.status(404).json("Unable to update profile");
      }
    })
    .catch((err) => res.status(400).json("Error updating user"));
};

module.exports = {
  handleProfile,
  handleProfileGet,
  handleProfileUpdate,
};
