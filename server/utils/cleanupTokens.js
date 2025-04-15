const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanupExpiredTokens() {
  try {
    const result = await prisma.token.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    console.log(`Deleted ${result.count} expired tokens.`);
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = cleanupExpiredTokens;
