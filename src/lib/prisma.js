const { PrismaClient } = require("@prisma/client");

const prisma =
  global.prismaGlobalInstance ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobalInstance = prisma;
}

module.exports = { prisma };
