const handleSignin = (db, bcrypt) => async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  try {
    const loginData = await db("login")
      .select("email", "hash")
      .where({ email });

    if (!loginData.length) {
      return res.status(400).json("Wrong credentials");
    }

    const isValid = bcrypt.compareSync(password, loginData[0].hash);

    if (!isValid) {
      return res.status(400).json("Wrong credentials");
    }

    const users = await db("users").select("*").where({ email });

    if (users.length) {
      return res.json(users[0]);
    } else {
      return res.status(400).json("User not found");
    }
  } catch (err) {
    console.error("Sign-in error:", err);
    return res.status(500).json("Server error during sign-in");
  }
};

module.exports = {
  handleSignin,
};
