const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')
const {FlatsRecord, FlatsRecordAns} = require("../../models/flats.record");
const {FlatsRepository} = require("../../models/repositories/flats/FlatsOffers.repository");
const {FlatsAnswersRepository} = require("../../models/repositories/flats/FlatsOffersAns.repository");


const flatsRouter = express.Router();

flatsRouter
    .get('/all', async (req, res) => {
        res.render('forms/basic/flats-table');
    })
    .get('/:number', async (req, res) => {
        const {number} = req.params
        const flatData = await FlatsRepository.find(number)
        const lastNumber = await FlatsRepository.getLastNumber()
        res.render('forms/basic/flat', {
            flat_data: flatData,
            lastNumber
        });
    })
    .get('/gpt/all', (req, res) => {
        res.render('forms/gpt/flats-table');
    })
    .get('/gpt/:number', async (req, res) => {
        const {number} = req.params
        const flatData = await FlatsRepository.find(number)
        const lastNumber = await FlatsRepository.getLastNumber()
        res.render('forms/gpt/flat', {
            flat_data: flatData,
            lastNumber
        });
    })

flatsRouter
    .route('/answers/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async (req, res) => {
        const data = req.body;
        const id = await FlatsAnswersRepository.insert(new FlatsRecordAns(data))
        res.status(202).json({"message": `${id}`})
    })
flatsRouter
    .route('/short-answers/')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async (req, res) => {
        const data = req.body;
        const id = await FlatsAnswersRepository.insertPartials(new FlatsRecordAns(data))
        res.status(202).json({"message": `${id}`})
    })


module.exports = {
    flatsRouter,
}