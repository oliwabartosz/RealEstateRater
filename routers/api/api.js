const express = require('express');
require('express-async-errors');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middlewares/verifyRoles');
const {FlatsRepository} = require('../../models/repositories/flats/FlatsOffers.repository');
const {FlatsRecord, FlatsGPTRecord} = require("../../models/flats.record");
const {FlatsGPTRepository} = require("../../models/repositories/flats/FlatsGptOffers.repository");
const {FlatsAnswersRepository} = require("../../models/repositories/flats/FlatsOffersAns.repository");

const apiRouter = express.Router();

apiRouter.route('/flats/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = await FlatsRepository.getAll()
        res.status(202).json(data)
    })
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = req.body;
        const id = await FlatsRepository.insert(new FlatsRecord(data))
        res.status(202).json({"message":`${id}`})
    })

apiRouter.route('/flats/answers')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = await FlatsAnswersRepository.getAll()
        res.status(202).json(data)
    })


apiRouter.route('/flats/gpt/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = await FlatsRepository.getAllDataForGPT()
        res.status(202).json(data)
    })
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = await req.body;
        const id = await FlatsGPTRepository.insert(new FlatsGPTRecord(data))
        res.status(202).json({"message":`${id}`})
    })


module.exports = {
    apiRouter,
}

