import express from 'express';
import {ROLES} from "../../config/roles";
import {verifyRoles} from "../../middlewares/verifyRoles";

export const housesRouter = express.Router();

housesRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })
