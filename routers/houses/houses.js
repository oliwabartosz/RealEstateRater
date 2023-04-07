const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')

const housesRouter = express.Router();

housesRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })

module.exports = {
    housesRouter,
}