const express = require('express');
const ROLES_LIST = require('../../config/roles')
const verifyRoles = require('../../middlewares/verifyRoles')

const flatsRouter = express.Router();

flatsRouter
    .get('/test', (req, res) => {
        res.send('Hello, sir!')
    })

module.exports = {
    flatsRouter,
}