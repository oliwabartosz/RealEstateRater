const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    //@TODO - usun jak dzialac bedzie

    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({
        "message": "Unauthorized",
    });

    // Get token, get rid of prefix
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({
                message: "Forbidden",
                response: 403
            });
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next()
        }
    )
}

module.exports = {
    verifyJwt,
}