const express = require('express');
require('express-async-errors');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middlewares/verifyRoles');
const {FlatsRepository} = require('../../models/repositories/flatsOffers.repository');
const {FlatsAnswersRepository} = require('../../models/repositories/flatsOffersAns.repository');
const {FlatsRecord} = require("../../models/flats.record");
const {FlatsRecordAns} = require("../../models/flats.record");
const {UsersRepository} = require("../../models/repositories/users.repository");

const apiRouter = express.Router();

apiRouter.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        res.status(200).send('ok');
    })

apiRouter.route('/flats/')
    .post(async (req, res) => {
        const data = req.body;
        const id = await FlatsAnswersRepository.insert(new FlatsRecord(data))
        res.status(202).json({"message":`${id}`})
    })

apiRouter.route('/flats/answers/')
    .post(async (req, res) => {
        const data = req.body;
        const id = await FlatsAnswersRepository.insert(new FlatsRecordAns(data))
        res.status(202).json({"message":`${id}`})
    })




module.exports = {
    apiRouter,
}

