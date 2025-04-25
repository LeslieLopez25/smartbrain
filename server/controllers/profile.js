// Handles retrieving a user's profile by ID
const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id }) // Look up the user by ID
    .then((user) => {
      if (user.length) {
        res.json(user[0]); // Return the user if found
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err) => res.status(400).json("Error getting user"));
};

// Handles updating a user's profile info
const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet, profile_image } = req.body;

  // Builds an object of only the fields that are provided
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (age !== undefined) updateFields.age = age;
  if (pet !== undefined) updateFields.pet = pet;
  if (profile_image !== undefined) updateFields.profile_image = profile_image;

  // If no fields to update were given, send an error
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  db("users")
    .where({ id })
    .update(updateFields)
    .returning("*")
    .then((users) => {
      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error updating user profile" });
    });
};

module.exports = {
  handleProfileGet,
  handleProfileUpdate,
};
