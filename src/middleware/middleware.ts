import { NextFunction, Request, Response } from "express";
import { auth } from "../../lib/auth";


export const enum userRole {
    USER = "USER",
    ADMIN = "ADMIN"

}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: any,
                name: string,
                role: string,
                email: string,
                emailVerified: boolean
            }
        }
    }
}

export function roleVerify(...role: userRole[]) {
    return async (req: Request, res: Response, next: NextFunction) => {

        try {
            const session = await auth.api.getSession({
                headers: req.headers as any
            })

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Your are not authorized"
                })
            }

            if (!session?.user?.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification requried, Please verify your email"
                })
            } 

            if (role.length && !role.includes(session.user.role as userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource"
                });
            }


            req.user = {
                id: session.user.id,
                name: session.user.name,
                role: session.user.role as string,
                email: session.user.email,
                emailVerified: session.user.emailVerified
            }

            next();
        } catch (error) {
            next(error)
        }
    };
}
