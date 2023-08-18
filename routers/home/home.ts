import {Request, Response, Router} from "express";

export const homeRouter: Router = Router();

homeRouter
    .get('/', (req: Request, res: Response) => {
        res.render('home/index')
    })
