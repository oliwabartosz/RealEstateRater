const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')
const {FlatsRecord} = require("../../models/flats.record");
const {FlatsRepository} = require("../../models/repositories/flatsOffers.repository");


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
module.exports = {
    flatsRouter,
}