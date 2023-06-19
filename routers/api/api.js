const express = require('express');
require('express-async-errors');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middlewares/verifyRoles');
const {FlatsRepository} = require('../../models/repositories/flats/FlatsOffers.repository');
const {FlatsAnswersRepository} = require('../../models/repositories/flats/FlatsOffersAns.repository');
const {FlatsRecord, FlatsGPTRecord, FlatsShortAnsRecord} = require("../../models/flats.record");
const {FlatsRecordAns} = require("../../models/flats.record");
const {UsersRepository} = require("../../models/repositories/users.repository");
const {FlatsGPTRepository} = require("../../models/repositories/flats/FlatsGptOffers.repository");
const {FlatsShortsAnswersRepository} = require("../../models/repositories/flats/FlatsShortAnsOffers.repository");

const apiRouter = express.Router();

apiRouter.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        res.status(200).send('ok');
    })

apiRouter.route('/flats/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = req.body;
        const id = await FlatsRepository.insert(new FlatsRecord(data))
        res.status(202).json({"message":`${id}`})
    })
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        const data = await FlatsRepository.getAll()
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

