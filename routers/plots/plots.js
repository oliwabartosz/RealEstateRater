const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')

const plotsRouter = express.Router();

plotsRouter
    .get('/', (req, res) => {
        res.redirect('/')
    })

module.exports = {
    plotsRouter,
}