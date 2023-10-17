import express from "express";
import {ROLES} from "../../config/roles";
import {verifyRoles} from "../../middlewares/verifyRoles";
import {FlatsRecord, FlatsRecordAns} from "../../models/flats.record";
import {FlatsOffersRepository} from "../../models/repositories/flats/FlatsOffers.repository";
import {FlatsAnswersRepository} from "../../models/repositories/flats/FlatsOffersAns.repository";
import {FlatsRepositoryGPT} from "../../models/repositories/flats/FlatsGptOffers.repository";
import {addStringToObjectKeys, getFilesFromDirectory} from "../utils";

export const flatsRouter = express.Router();

flatsRouter
    .get('/', async (req, res) => {
        const flatsList = await FlatsOffersRepository.getAll()
        const username = req.user;

        res.render('forms/basic/flats-table', {
            flatsList,
            username,
        });
    })
    .get('/gpt/', async (req, res) => {
        const flatsGPTList = await FlatsRepositoryGPT.getAll()
        const flatsList = await FlatsOffersRepository.getAll()
        const username = req.user;

        res.render('forms/gpt/flats-table', {
            flatsGPTList,
            flatsList,
            username
        });
    })

    .get('/:number', async (req, res) => {
        const {number} = req.params;
        const firstNumber = await FlatsOffersRepository.getFirstNumber();
        const lastNumber = await FlatsOffersRepository.getLastNumber();

        const isInvalidNumber =
            isNaN(Number(number)) ||
            Number(number) > Number(lastNumber) ||
            Number(number) < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/');
        }

        const id = await FlatsOffersRepository.getIdByNumber(number)
        const flatData = await FlatsOffersRepository.find(number);
        const offerIdExpected = flatData['offerIdExpected' as keyof FlatsRecord];
        const flatAnsData = await FlatsAnswersRepository.find(id);
        const flatGPTData = await FlatsRepositoryGPT.find(id);

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
        const {number} = req.params;
        const firstNumber = await FlatsOffersRepository.getFirstNumber();
        const lastNumber = await FlatsOffersRepository.getLastNumber();

        const isInvalidNumber = isNaN(Number(number)) ||
            Number(number) > Number(lastNumber) ||
            Number(number) < Number(firstNumber);

        if (isInvalidNumber) {
            return res.redirect('/rer/flats/gpt');
        }

        const flatData = await FlatsOffersRepository.find(number);
        const offerIdExpected = flatData['offerIdExpected' as keyof FlatsRecord];
        const id = await FlatsOffersRepository.getIdByNumber(number)
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
    .post(verifyRoles(ROLES.Admin, ROLES.User), async (req, res) => {
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

        await FlatsAnswersRepository.insert(new FlatsRecordAns(data, {}))
        res.redirect(`${Number(number)}`)
    })

flatsRouter
    .route('/gpt/:number')
    .post(verifyRoles(ROLES.Admin, ROLES.User), async (req, res) => {
        const {number} = req.params;
        const id = await FlatsOffersRepository.getIdByNumber(String(Number(number) - 1))
        const originalData = await FlatsAnswersRepository.find(id);

        const data = req.body;
        data.number = Number(number) - 1;
        data.user = req.user;
        data.delete = (data.delete === 'checked') ? 'tak' : null;
        addStringToObjectKeys(data, 'Ans');

        await FlatsAnswersRepository.insert(new FlatsRecordAns(data, {}))

        res.redirect(`${Number(number)}`)
    })

// API @TODO: Q: is that necessary?? A: THIS IS FOR FRONT-END (fetch)
flatsRouter
    .route('/answers/')
    .post(verifyRoles(ROLES.Admin, ROLES.User), async (req, res) => {
        const data = req.body;
        const id = await FlatsAnswersRepository.insert(new FlatsRecordAns(data, {}))
        res.status(202).json({"message": `${id}`})
    })