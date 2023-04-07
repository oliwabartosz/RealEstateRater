const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')
const {FlatsRepository} = require('../../models/repositories/flats.repository')
const {TestRepository} = require("../../models/repositories/test.repository");
const {FlatsRecord} = require("../../models/flats.record");

const apiRouter = express.Router();

apiRouter
    .post('/flats/', async (req, res) => {
        const data = req.body;
        console.log(new FlatsRecord(data))
        await FlatsRepository.insert(new FlatsRecord(data))
        res.status(202).json({"meesage":`${await FlatsRepository.insert(new FlatsRecord(data))}`})
    })




    .get('/', async (req, res) => {
        const id = '67b3c3c5-80ef-47f8-b433-0ff75be76e97';
        console.log(await TestRepository.find(id));
        res.status(200).send('ok')
    })

module.exports = {
    apiRouter,
}