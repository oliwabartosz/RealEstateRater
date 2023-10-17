import express from "express";
import {ROLES} from "../../config/roles";
import {verifyRoles} from "../../middlewares/verifyRoles";

export const plotsRouter = express.Router();

plotsRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })
