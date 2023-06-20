const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')
const {FlatsRecord, FlatsRecordAns} = require("../../models/flats.record");
const {FlatsRepository} = require("../../models/repositories/flats/FlatsOffers.repository");
const {FlatsAnswersRepository} = require("../../models/repositories/flats/FlatsOffersAns.repository");
const {FlatsGPTRepository} = require("../../models/repositories/flats/FlatsGptOffers.repository");


const flatsRouter = express.Router();

flatsRouter
    .get('/', async (req, res) => {
        const flatsList = await FlatsRepository.getAll()

        res.render('forms/basic/flats-table', {
            flatsList,
        });
    })
    .get('/gpt/', async (req, res) => {
        const flatsGPTList = await FlatsGPTRepository.getAll()
        const flatsList = await FlatsRepository.getAll()

        res.render('forms/gpt/flats-table', {
            flatsGPTList,
            flatsList,
        });
    })

    .get('/:number', async (req, res) => {
        const { number } = req.params;
        const flatData = await FlatsRepository.find(number);
        const firstNumber = await FlatsRepository.getFirstNumber();
        const lastNumber = await FlatsRepository.getLastNumber();

        const isInvalidNumber = isNaN(number) || number > Number(lastNumber) || number < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/');
        }

        res.render('forms/basic/flat', {
            flat_data: flatData,
            lastNumber
        });
    })
    .get('/gpt/:number', async (req, res) => {
        const { number } = req.params;
        const flatData = await FlatsRepository.find(number);
        const firstNumber = await FlatsRepository.getFirstNumber();
        const lastNumber = await FlatsRepository.getLastNumber();

        const isInvalidNumber = isNaN(number) || number > Number(lastNumber) || number < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/gpt');
        }

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