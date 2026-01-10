import { Request, Response, NextFunction } from 'express'
 export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(500)
    res.json({'error ': { error: err, er:"Next Error" }})
}
