const jwt = require("jsonwebtoken");
require('dotenv').config();

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    console.log(refreshToken)
    const foundUser = usersDb.users.find(person => person.refreshToken === refreshToken);
    console.log(usersDb.users.find(person => person.username === 'test1'))
    if (!foundUser) return res.sendStatus(403); //Forbidden

    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({accessToken})
        }
    )
}


module.exports = {
    handleRefreshToken
}