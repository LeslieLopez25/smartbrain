const cron = require("node-cron");
const cleanupExpiredTokens = require("./cleanupTokens");

cron.schedule("0 0 * * *", () => {
  console.log("Running token cleanup...");
  cleanupExpiredTokens();
});
