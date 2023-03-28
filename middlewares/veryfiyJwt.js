const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401); // 401 - Unauthorized
    console.log(authHeader); // Bearer token
    // Get token, get rid of prefix
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // invalid token - 403 Forbidden
            req.user = decoded.username
            next()
        }
    )
}

module.exports = {
    verifyJwt,
}