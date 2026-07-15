const { PrismaClient } = require("@prisma/client");

const Prisma =
  global.PrismaGlobalInstance ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.PrismaGlobalInstance = Prisma;
}

module.exports = { Prisma };
