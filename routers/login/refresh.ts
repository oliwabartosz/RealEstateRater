import express from "express";
import {handleRefreshToken} from "../../controllers/refreshTokenController";

export const refreshRouter = express.Router();
refreshRouter
    .get('/', handleRefreshToken)