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
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).send('User and password are required.')  // 400 - Bad request
    const foundUser = usersDb.users.find(person => person.username === username);
    if (!foundUser) return res.status(401).send('Bad login or password'); // 401 - Unauthorized

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
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
        res.status(401).send('Bad login or password'); // 401 - Unauthorized
    }
};

module.exports = {
    handleLogin
}