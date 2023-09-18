import express from "express";
import "express-async-errors";

import {ROLES} from "../../config/roles";

import {verifyRoles} from "../../middlewares/verifyRoles";

const {FlatsRepository} = require('../../models/repositories/flats/FlatsOffers.repository');
const {FlatsRecord, FlatsGPTRecord} = require("../../models/flats.record");
const {FlatsGPTRepository} = require("../../models/repositories/flats/FlatsGptOffers.repository");

const apiRouter = express.Router();

export apiRouter.route('/flats/')
    .get(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = await FlatsRepository.getAll()
        res.status(202).json(data)
    })
    .post(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = req.body;
        const id = await FlatsRepository.insert(new FlatsRecord(data))
        res.status(202).json({"message":`${id}`})
    })


apiRouter.route('/flats/gpt/')
    .get(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = await FlatsRepository.getAllDataForGPT()
        res.status(202).json(data)
    })
    .post(verifyRoles(ROLES.Admin, ROLES.Api), async (req, res) => {
        const data = await req.body;
        const id = await FlatsGPTRepository.insert(new FlatsGPTRecord(data))
        res.status(202).json({"message":`${id}`})
    })
