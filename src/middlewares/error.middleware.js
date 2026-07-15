const { Prisma: PrismaNamespace } = require("@prisma/client");
const { AppError } = require("../utils/AppError");

function ErrorMiddleware(Error, _req, res, _next) {
  if (Error instanceof AppError) {
    res.status(Error.StatusCode).json({
      success: false,
      error: {
        code: Error.Code,
        message: Error.message,
        details: Error.Details ?? [],
      },
    });
    return;
  }

  if (Error instanceof PrismaNamespace.PrismaClientKnownRequestError) {
    if (Error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "A record with this value already exists",
          details: Error.meta ?? [],
        },
      });
      return;
    }

    if (Error.code === "P2025") {
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

  console.error(Error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error",
      details: [],
    },
  });
}

module.exports = { ErrorMiddleware };
