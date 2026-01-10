import { Request, Response, NextFunction } from "express";
import { Prisma } from "../../generated/prisma/client";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Invalid or missing request fields.";
  }

  // Prisma Known Request Error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errorMessage =
          "This data already exists. Please use a different value.";
        break;

      case "P2025":
        statusCode = 404;
        errorMessage = "The requested record was not found.";
        break;

      case "P2003":
        statusCode = 400;
        errorMessage =
          "Operation failed due to a related record constraint.";
        break;

      default:
        statusCode = 400;
        errorMessage = "The request could not be completed.";
    }
  }

  if (res.headersSent) {
    return next(err);
  }

  return res.status(statusCode).json({
    statusCode,
    message: errorMessage,
    errorDeatils: err
  });
}
