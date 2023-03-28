const express = require('express');
const refreshRouter = express.Router();
const refreshTokenController = require('../../controllers/refreshTokenController')

refreshRouter
    .get('/', refreshTokenController.handleRefreshToken)

module.exports = {
    refreshRouter,
};