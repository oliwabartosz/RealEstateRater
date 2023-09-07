import {Request, Response, NextFunction} from "express";

export const verifyRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req?.roles) return res.sendStatus(401); // 401: Unauthorized
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if (!result) return res.sendStatus(401);  // 401: Unauthorized
        next();
    }
}
