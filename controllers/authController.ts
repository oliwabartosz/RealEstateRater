import {config} from "dotenv";
config();
import {Request, Response} from "express";
import {JWT_ACCESS_TOKEN_TIME, JWT_REFRESH_TOKEN_TIME} from "../config/generalJWTConfig";

import {
    checkUserNamePassword,
    checkIfUserExists,
    checkPassword,
    getRolesFromDatabase,
    createAccessToken,
    createRefreshToken,
    goToHomePage
} from "./utils/utils";
import {RequestBody} from "../types";


export const handleLogin = async (req: Request, res: Response) => {
    const {username, password}: RequestBody  = req.body;

    // Check if user provided username and password
    if (checkUserNamePassword(req, res, username, password)) {
        return;
    }

    // Check if user provided username and password
    if (await checkIfUserExists(req, res, username, 1)) {
        return;
    }

    // Check if password stored in database is correct
    if (!await checkPassword(req, res, username, password)) {
        return;
    }

    // Get roles by username
    const roles = await getRolesFromDatabase(username) // [1, 2, 3]

    // Creates JWT
    /// Creates AccessToken and sends it as JSON.
    const accessToken = createAccessToken(res, username, roles, JWT_ACCESS_TOKEN_TIME);

    /// Creates refreshToken and sends it to database and cookie.
    await createRefreshToken(res, username, accessToken, JWT_REFRESH_TOKEN_TIME);

    if (username !== 'Api') {
        goToHomePage(res)
    }

}
