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
  handleProfileGet,
  handleProfileUpdate,
};
