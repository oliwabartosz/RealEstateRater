import express from "express";
import {ROLES} from "../../config/roles";
import {verifyRoles} from "../../middlewares/verifyRoles";
import {addStringToObjectKeys, getFilesFromDirectory} from "../utils";
import {RealEstateRecord} from "../../types";
import {RealEstateRepository} from "../../models/repositories/RealEstate.respository";

export const flatsRouter = express.Router();

flatsRouter
    .get('/', async (req, res) => {
        const flatsList = await new RealEstateRepository('flats').getAll()
        const username = req.user;

        res.render('forms/basic/flats-table', {
            flatsList,
            username,
        });
    })

    .get('/gpt/', async (req, res) => {
        const flatsList = await new RealEstateRepository('flats').getAll()
        const username = req.user;

        res.render('forms/gpt/flats-table', {
            flatsList,
            username
        });
    })

    .get('/:number', async (req, res) => {
        const flatsRepository = new RealEstateRepository('flats')
        const flatsRepositoryAns = new RealEstateRepository('flatsAns')
        const flatsRepositoryGPT = new RealEstateRepository('flatsGPT')

        const {number} = req.params;
        const firstNumber = await new RealEstateRepository('flats').getFirstOrLastNumber('first');
        const lastNumber = await new RealEstateRepository('flats').getFirstOrLastNumber('last');

        const isInvalidNumber =
            isNaN(Number(number)) ||
            Number(number) > Number(lastNumber) ||
            Number(number) < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/');
        }

        const id = await flatsRepository.getIdByNumber(number)
        const flatData = await flatsRepository.findByNumber(number);
        const offerIdExpected: string = flatData['offerIdExpected' as keyof RealEstateRecord];
        const flatAnsData = await flatsRepositoryAns.findByID(id);
        const flatGPTData = await flatsRepositoryGPT.findByID(id);
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
        const flatsRepository = new RealEstateRepository('flats')
        const flatsRepositoryAns = new RealEstateRepository('flatsAns')

        const {number} = req.params;
        const firstNumber = await flatsRepository.getFirstOrLastNumber('first');
        const lastNumber = await flatsRepository.getFirstOrLastNumber('last');

        const isInvalidNumber = isNaN(Number(number)) ||
            Number(number) > Number(lastNumber) ||
            Number(number) < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/gpt');
        }

        const flatData = await flatsRepository.findByNumber(number);
        const offerIdExpected = flatData['offerIdExpected' as keyof RealEstateRecord];
        const id = await flatsRepository.getIdByNumber(number)
        const flatAnsData = await flatsRepositoryAns.findByID(id);

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
    .post(async (req, res) => {
        const flatsRepository = new RealEstateRepository('flatsAns')
        const {number} = req.params;

        const user = req.user;
        let data = req.body;

        data.delete = (data.delete === 'checked') ? 'tak' : 'nie';
        data.comments = (data.comments === '') ? null : data.comments;
        data.rent = (data.rent === '') ? null : data.rent;

        data = addStringToObjectKeys(data, 'Ans');

        data.rateStatus = 'done';
        data.number = Number(number) - 1;
        data.user = user;

        await flatsRepository.insertOrUpdateAnswers(data)
        res.redirect(`${Number(number)}`)
    })

// flatsRouter
//     .route('/gpt/:number')
//     .post(verifyRoles(ROLES.Admin, ROLES.User), async (req, res) => {
//         const {number} = req.params;
//         const id = await FlatsOffersRepository.getIdByNumber(String(Number(number) - 1))
//         const originalData = await FlatsAnswersRepository.find(id);
//
//         const data = req.body;
//         data.number = Number(number) - 1;
//         data.user = req.user;
//         data.delete = (data.delete === 'checked') ? 'tak' : null;
//         addStringToObjectKeys(data, 'Ans');
//
//         await FlatsAnswersRepository.insert(new FlatsRecordAns(data, {}))
//
//         res.redirect(`${Number(number)}`)
//     })
//
// // API @TODO: Q: is that necessary?? A: THIS IS FOR FRONT-END (fetch)
// flatsRouter
//     .route('/answers/')
//     .post(verifyRoles(ROLES.Admin, ROLES.User), async (req, res) => {
//         const data = req.body;
//         const id = await FlatsAnswersRepository.insert(new FlatsRecordAns(data, {}))
//         res.status(202).json({"message": `${id}`})
//     })