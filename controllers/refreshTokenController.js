const jwt = require("jsonwebtoken");
const {UsersRecord} = require("../models/users.record");
const {getRefreshToken, evaluateJWT} = require("./utils/utils");
require('dotenv').config();

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const {username} = await getRefreshToken(refreshToken)
    console.log(await getRefreshToken(refreshToken))

    if (!username) return res.sendStatus(403); // Forbidden

    // Evaluate JWT
    await evaluateJWT(refreshToken, username, res);

}


module.exports = {
    handleRefreshToken
}