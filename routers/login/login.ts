import {Request, Response, Router} from "express";

export const loginRouter = Router();

loginRouter
    .get('/', (req: Request, res: Response): void => {
        res.render('login/login')
    })