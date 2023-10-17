import {Request, Response, Router} from "express";
import {handleLogin} from "../../controllers/authController";

export const authRouter: Router = Router();
authRouter
    .post('/', handleLogin)