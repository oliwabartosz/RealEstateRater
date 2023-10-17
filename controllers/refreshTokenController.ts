import {Request, Response} from "express";
import {getRefreshToken, evaluateJWT} from "./utils/utils";
import {config} from "dotenv";
config();

export const handleRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const {username} = await getRefreshToken(refreshToken)
    console.log(await getRefreshToken(refreshToken))

    if (!username) return res.sendStatus(403); // Forbidden

    // Evaluate JWT
    await evaluateJWT(res, refreshToken, username);

}