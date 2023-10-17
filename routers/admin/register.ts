import express from "express";
import {handleNewUser} from "../../controllers/registrationController";
import {verifyRoles} from "../../middlewares/verifyRoles";
import {ROLES} from "../../config/roles";

export const registerRouter = express.Router();
registerRouter.route('/')
    .post(verifyRoles(Number(String(ROLES.Admin))), handleNewUser)
