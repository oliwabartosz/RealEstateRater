const {writeFile} = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const handleLogin = async (req, res) => {
    const {user, pass} = req.body;
    if (!user || !pass) return res.status(400).send('User and password are required.')  // 400 - Bad request
    const foundUser = usersDb.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); // 401 - Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(pass, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {"username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        )
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )
        const otherUsers = usersDb.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken}
        usersDb.setUsers([...otherUsers, currentUser])
        await writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDb.users)
        )

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
        res.json({accessToken})
    } else {
        res.sendStatus(401); // 401 - Unauthorized
    }
};

module.exports = {
    handleLogin
}