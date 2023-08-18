import {Request, Response, Router} from "express";

export const authRouter: Router = Router();

//@TODO: convert to ts
const authController = require('../../controllers/authController')

authRouter
    .post('/', authController.handleLogin)