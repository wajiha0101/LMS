const { Prisma: PrismaNamespace } = require("@prisma/client");
const { AppError } = require("../utils/AppError");

function errorMiddleware(error, _req, res, _next) {
  if (error instanceof AppError) {
    res.status(error.StatusCode).json({
      success: false,
      error: {
        code: error.Code,
        message: error.message,
        details: error.Details ?? [],
      },
    });
    return;
  }

  if (error instanceof PrismaNamespace.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "A record with this value already exists",
          details: error.meta ?? [],
        },
      });
      return;
    }

    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
          details: [],
        },
      });
      return;
    }
  }

  console.error(error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      details: [],
    },
  });
}

module.exports = { errorMiddleware };
