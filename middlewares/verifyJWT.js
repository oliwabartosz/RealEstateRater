const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyJwt = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Get token, get rid of prefix (for authHeader)
    const token = req.cookies.jwt_a || (authHeader && authHeader.split(' ')[1]);

    if (authHeader) {
        if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({
            "message": "Unauthorized"
        });
    }

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