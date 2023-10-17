import express from "express";
import 'express-async-errors';
import {ROLES} from "../../config/roles";
import {verifyRoles} from "../../middlewares/verifyRoles";
import {FlatsOffersRepository} from '../../models/repositories/flats/FlatsOffers.repository';
import {FlatsRecord, FlatsRecordGPT} from "../../models/flats.record";
import {FlatsRepositoryGPT} from "../../models/repositories/flats/FlatsGptOffers.repository";

export const apiRouter = express.Router();

apiRouter.route('/flats/')
    .get(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = await FlatsOffersRepository.getAll()
        res.status(202).json(data)
    })
    .post(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = req.body;
        const id = await FlatsOffersRepository.insert(new FlatsRecord(data, {}))
        res.status(202).json({"message":`${id}`})
    })


apiRouter.route('/flats/gpt/')
    .get(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = await FlatsOffersRepository.getAllDataForGPT()
        res.status(202).json(data)
    })
    .post(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = await req.body;
        const id = await FlatsRepositoryGPT.insert(new FlatsRecordGPT(data, {}))
        res.status(202).json({"message":`${id}`})
    })
