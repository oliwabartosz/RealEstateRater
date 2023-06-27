const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')
const {FlatsRecord, FlatsRecordAns} = require("../../models/flats.record");
const {FlatsRepository} = require("../../models/repositories/flats/FlatsOffers.repository");
const {FlatsAnswersRepository} = require("../../models/repositories/flats/FlatsOffersAns.repository");
const {FlatsGPTRepository} = require("../../models/repositories/flats/FlatsGptOffers.repository");
const {addStringToObjectKeys, getFilesFromDirectory} = require("../utils");

const flatsRouter = express.Router();

flatsRouter
    .get('/', async (req, res) => {
        const flatsList = await FlatsRepository.getAll()
        const username = req.user;

        res.render('forms/basic/flats-table', {
            flatsList,
            username,
        });
    })
    .get('/gpt/', async (req, res) => {
        const flatsGPTList = await FlatsGPTRepository.getAll()
        const flatsList = await FlatsRepository.getAll()
        const username = req.user;

        res.render('forms/gpt/flats-table', {
            flatsGPTList,
            flatsList,
            username
        });
    })

    .get('/:number', async (req, res) => {
        const { number } = req.params;
        const firstNumber = await FlatsRepository.getFirstNumber();
        const lastNumber = await FlatsRepository.getLastNumber();

        const isInvalidNumber = isNaN(number) || number > Number(lastNumber) || number < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/');
        }

        const id = await FlatsRepository.getIdByNumber(number)
        const flatData = await FlatsRepository.find(number);
        const offerIdExpected = flatData.offerIdExpected;
        const flatAnsData = await FlatsAnswersRepository.find(id);
        const flatGPTData = await FlatsGPTRepository.find(id);

        const username = req.user;

        const images = getFilesFromDirectory(`./public/images/offers/${offerIdExpected}`)



        res.render('forms/basic/flat', {
            flat_data: flatData,
            flat_ans_data: flatAnsData,
            flat_gpt_data: flatGPTData,
            images,
            offerIdExpected,
            lastNumber,
            username,
        });
    })
    .get('/gpt/:number', async (req, res) => {
        const { number } = req.params;
        const firstNumber = await FlatsRepository.getFirstNumber();
        const lastNumber = await FlatsRepository.getLastNumber();

        const isInvalidNumber = isNaN(number) || number > Number(lastNumber) || number < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/gpt');
        }

        const flatData = await FlatsRepository.find(number);
        const offerIdExpected = flatData.offerIdExpected;
        const id = await FlatsRepository.getIdByNumber(number)
        const flatAnsData = await FlatsAnswersRepository.find(id);

        const username = req.user;

        const images = getFilesFromDirectory(`./public/images/offers/${offerIdExpected}`)



        res.render('forms/gpt/flat', {
            flat_data: flatData,
            lastNumber,
            offerIdExpected,
            images,
            flat_ans_data: flatAnsData,
            username
        });
    })

flatsRouter
    .route('/:number')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async (req, res) => {
        const {number} = req.params;

        const user = req.user;
        const data = req.body;

        data.delete = (data.delete === 'checked') ? 'tak' : 'nie';
        data.comments = (data.comments === '') ? null : data.comments;
        data.rent = (data.rent === '') ? null : data.rent;
        data.rateStatus = 'done';

        addStringToObjectKeys(data, 'Ans');

        data.number = Number(number) - 1;
        data.user = user;

        await FlatsAnswersRepository.insert(new FlatsRecordAns(data))
        res.redirect(`${Number(number)}`)
    })

flatsRouter
    .route('/gpt/:number')
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async (req, res) => {
        const {number} = req.params;
        const id = await FlatsRepository.getIdByNumber(number - 1)
        const originalData = await FlatsAnswersRepository.find(id);

        const { technologyAns, lawStatusAns, balconyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, rentAns, commentsAns, deleteAns, rateStatus } = originalData

        const user = req.user;
        const data = req.body;

        data.comments = (data.comments === '') ? null : data.comments;

        addStringToObjectKeys(data, 'Ans');

        data.number = Number(number) - 1;
        data.technologyAns = (data.technologyAns  === null) ? technologyAns : data.technologyAns;
        data.deleteAns = (data.deleteAns  === undefined) ? deleteAns : data.deleteAns;
        data.deleteAns = (data.deleteAns === 'checked') ? 'tak' : data.deleteAns;
        data.rateStatus = (data.rateStatus === undefined) ? rateStatus : data.rateStatus;
        data.lawStatusAns = lawStatusAns;
        data.balconyAns = balconyAns;
        data.elevatorAns = elevatorAns;
        data.basementAns = basementAns;
        data.garageAns = garageAns;
        data.gardenAns = gardenAns;
        data.modernizationAns = (data.modernizationAns  === null) ? modernizationAns : data.modernizationAns;
        data.alarmAns = alarmAns;
        data.kitchenAns = (data.kitchenAns  === null) ? kitchenAns : data.kitchenAns;
        data.outbuildingAns = outbuildingAns;
        data.qualityAns = (data.qualityAns  === null) ? qualityAns : data.qualityAns;
        data.rentAns = rentAns;
        data.commentsAns = (data.commentsAns  === null) ? commentsAns : data.commentsAns;

        data.user = user;

        await FlatsAnswersRepository.insert(new FlatsRecordAns(data))
        res.redirect(`${Number(number)}`)
    })


// API
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