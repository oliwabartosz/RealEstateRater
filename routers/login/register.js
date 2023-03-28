const express = require('express');
const registerRouter = express.Router();
const registerController = require('../../controllers/registrationController')

registerRouter
    .post('/', registerController.handleNewUser)

module.exports = {
    registerRouter,
};