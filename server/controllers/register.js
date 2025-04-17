const handleRegister = (db, bcrypt) => async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission");
  }

  const hash = bcrypt.hashSync(password);

  try {
    const newUser = await db.transaction(async (trx) => {
      const loginEmail = await trx("login")
        .insert({ hash, email })
        .returning("email");

      const users = await trx("users")
        .insert({
          email: loginEmail[0].email,
          name,
          joined: new Date(),
        })
        .returning("*");

      return users[0];
    });

    return res.json(newUser);
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(400).json("Unable to register");
  }
};

module.exports = {
  handleRegister,
};
