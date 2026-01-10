import { Request, Response, NextFunction } from 'express'
import { Prisma } from '../../generated/prisma/client';
export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;

    // Prisma Client Validation Error

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provide incorrect field type or missing fields";
        errorDetails = err
    }
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.json({
        message: errorMessage,
        statusCode: statusCode,
        errorDetails

    })
}
