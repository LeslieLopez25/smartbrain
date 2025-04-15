const jwt = require("jsonwebtoken");

const JWTSECRET = process.env.JWTSECRET;

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch((err) => Promise.reject("unable to get user"));
      } else {
        Promise.reject("wrong credentials");
      }
    })
    .catch((err) => Promise.reject("wrong credentials"));
};

const getAuthTokenId = (db, req, res) => {
  const { authorization } = req.headers;
  db("tokens")
    .where({ token: authorization })
    .andWhere("expires_at", ">", new Date())
    .then((rows) => {
      if (rows.length) {
        res.json({ success: "true", userId: rows[0].user_id });
      } else {
        res.status(401).json("Unauthorized");
      }
    })
    .catch((err) => res.status(400).json("Error verifying token"));
};

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, JWTSECRET, { expiresIn: "30mins" });
};

const createSession = async (db, user) => {
  const { email, id } = user;
  const token = signToken(email);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);

  await db("tokens").insert({
    token,
    user_id: id,
    expires_at: expiresAt,
  });

  return { success: "true", userId: id, token };
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId()
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSession(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  signinAuthentication: signinAuthentication,
};
