import {checkUserNamePassword, checkIfUserExists, createNewUser, checkRolesProvided} from "./utils/utils";
import {UsersRepository} from "../models/repositories/users.repository";
import {Request, Response} from "express";
import {RequestBody} from "../types";


export const handleNewUser = async (req: Request, res: Response) => {
    const {username, password}: RequestBody = req.body;

    // Check if user provided username and password
    if (checkUserNamePassword(req, res, username, password)) {
        return;
    }

    // Checks if roles are correct - user can add roles ['user', 'api', 'admin']
    // If roles is empty Array or not provided, the 'user' role is set.
    if (checkRolesProvided(req, res)) {
        return;
    }

    // Checks if username exists in a database
    if (await checkIfUserExists(req, res, username, 0)) {
        return;
    }

    await createNewUser(req, res);

}