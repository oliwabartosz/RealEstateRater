import express from "express";
import {handleLogout} from "../../controllers/logoutController";

export const logoutRouter = express.Router();
logoutRouter
    .get('/', handleLogout)