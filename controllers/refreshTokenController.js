const jwt = require("jsonwebtoken");
require('dotenv').config();

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)  // 401 - Unauthorized
    const refreshToken = cookies.jwt;
    const foundUser = usersDb.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser) return res.sendStatus(403); // 403 - Unauthorized

    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {'username': decoded.username},
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