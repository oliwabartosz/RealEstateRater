const express = require('express');
require('express-async-errors');
const ROLES_LIST = require('../../config/roles');
const verifyRoles = require('../../middlewares/verifyRoles');
const {FlatsRepository} = require('../../models/repositories/flatsOffers.repository');
const {FlatsRecord} = require("../../models/flats.record");
const {UsersRepository} = require("../../models/repositories/users.repository");

const apiRouter = express.Router();

apiRouter.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.API), async (req, res) => {
        res.status(200).send('ok');
    })
    .post(async (req, res) => {
        const data = req.body;
        const id = await FlatsRepository.insert(new FlatsRecord(data))
        res.status(202).json({"meesage":`${id}`})
    })

module.exports = {
    apiRouter,
}


    // @TODO - flats
    // .post('/flats/', async (req, res) => {
    //     const data = req.body;
    //     console.log(new FlatsRecord(data))
    //     await FlatsRepository.insert(new FlatsRecord(data))
    //     res.status(202).json({"meesage":`${await FlatsRepository.insert(new FlatsRecord(data))}`})
    // })