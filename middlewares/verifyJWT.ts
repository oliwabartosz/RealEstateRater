import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import {config} from "dotenv";
import {JwtPayloadCustom} from "../types/interfaces/jwtpayload";
config();

declare global {
    namespace Express {
        interface Request {
            user?: string;
            roles?: string[];
        }
    }
}

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | string[] = req.headers.authorization || req.headers.Authorization;

    // Get token, get rid of prefix (for authHeader)
    const token: string = req.cookies.jwt_a || (typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined);


    if (authHeader) {
        if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            return; //@TODO - return or empty here?
            // Authentication header is valid
        } else {
            return res.status(401).json({
                "message": "Unauthorized"
            });
        }
    }

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded: JwtPayloadCustom) => {
            if (err) return res.status(403).json({
                message: "Forbidden",
                response: 403
            });
            const jwtPayload = decoded as JwtPayloadCustom; // Cast to JwtPayload if needed
            req.user = jwtPayload.UserInfo.username;
            req.roles = jwtPayload.UserInfo.roles;
            next();
        }
    )
}
