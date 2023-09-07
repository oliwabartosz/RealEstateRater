import path from "path";
import {writeFile} from "fs";
import {Request, Response} from "express";

export const handleLogout = async (req: Request, res: Response) => {
    // @TODO: Delete accessToken on client (front-end)

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)  // 204 - No content
    const refreshToken = cookies.jwt;

    res.clearCookie('jwt', {httpOnly: true, sameSite: "none", secure: true})
    res.sendStatus(204)
}

