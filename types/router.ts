import {Router} from "express";

export interface ExpressRouter {
    urlPrefix: string;
    router: Router;
}