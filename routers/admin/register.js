const express = require('express');
const registerRouter = express.Router();
const registerController = require('../../controllers/registrationController')
const verifyRoles = require("../../middlewares/verifyRoles");
const ROLES_LIST = require('../../config/roles');

registerRouter.route('/')
    .post(verifyRoles(ROLES_LIST.Admin), registerController.handleNewUser)

module.exports = {
    registerRouter,
};