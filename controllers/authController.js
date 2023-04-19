const {writeFile} = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {checkUserNamePassword, checkIfUserExists, checkPassword, getRolesFromDatabase, createAccessToken,
    createRefreshToken
} = require("./utils/utils");
require('dotenv').config();

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const handleLogin = async (req, res) => {
    const {username, password} = req.body;

    // Check if user provided username and password
    if (checkUserNamePassword(req, res, username, password)) {
        return;
    }

    // Check if user provided username and password
    if (await checkIfUserExists(req, res, username)) {
        return;
    }

    // Check if password stored in database is correct
    if (!await checkPassword(req, res, username, password)) {
        return;
    }

    // Get roles by username
    const roles = await getRolesFromDatabase(username) // [1, 2, 3]
    console.log(roles)

    // Creates JWT
    /// Creates AccessToken and sends it as JSON.
    const accessToken = createAccessToken(res, username, roles);

    /// Creates refreshToken and sends it to database and cookie.
    await createRefreshToken(res, username, accessToken);


}

module.exports = {
    handleLogin
}