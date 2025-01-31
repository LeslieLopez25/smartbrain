const bcrypt = require("bcrypt-nodejs");

// Replace with the password you used during registration
const enteredPassword = "test";

// Replace this with the actual stored hash from the "login" table
const plaintextPassword = "test";
const storedHash =
  "$2a$10$4RuX2iQl6znHHnZ.9Te1vOnVK2qMnZMHZEnU/8Tg1Cpf05Y6T2ckK";

const isMatch = bcrypt.compareSync(plaintextPassword, storedHash);
console.log("🔎 Does password match the hash?", isMatch);
