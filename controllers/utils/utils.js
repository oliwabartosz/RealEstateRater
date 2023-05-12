const {UsersRepository} = require("../../models/repositories/users.repository");
const bcrypt = require("bcrypt");
const {UsersRecord} = require("../../models/users.record");
const jwt = require("jsonwebtoken");
const {JWT_ACCESS_TOKEN_TIME, JWT_REFRESH_TOKEN_TIME} = require("../../config/generalConfig");

function _convertRolesToProperFormat(req) {
    const roles = req.body.roles ?? [];
    if (!Array.isArray(roles)) {
        return null;
    }
    return Array.from(new Set(roles.map(role => role.toLowerCase())));
}

function checkUserNamePassword(req, res, username, password) {
    if (!username || !password) {
        res.status(400).json({
            message: 'Bad input',
            response: 400,
        });
        return true;
    }
    return false;
}

function checkRolesProvided(req, res) {
    const roles = _convertRolesToProperFormat(req);
    const validRoles = new Set(['user', 'admin', 'api']);

    if (!roles?.every?.(role => validRoles.has(role))) {
        res.status(400).json({
            message: 'Bad input in roles',
            response: 400,
        });
        return true;
    }
    return false;
}

async function checkIfUserExists(req, res, username, desiredNumber) {
    const findUser = await UsersRepository.findUserByUsername(username)
    if (findUser !== desiredNumber) {
        res.status(409).json({
            "message": "Conflict",
            "response": 409
        });
        return true;
    }
    return false;
}

async function checkPassword(req, res, username, passwordProvided) {
    const {password: passwordInDatabase} = await UsersRepository.getPasswordFromDatabase(username)

    const match = await bcrypt.compare(passwordProvided, passwordInDatabase);

    if (!match) {
        res.status(401).json({
            "message": "Unauthorized.",
            "response": 401
        });
        return false;
    } else {
        return true;
    }
}

async function getRolesFromDatabase(username) {
    return UsersRepository.getRolesFromDatabase(username);

}

async function createNewUser(req, res) {
    const {username, password} = req.body;
    const roles = _convertRolesToProperFormat(req);

    try {
        // password encryption
        const hashedPass = await bcrypt.hash(String(password), 10);

        const newUser = {
            "username": username.toLowerCase(),
            "roles": roles,
            "refreshToken": null,
            "password": hashedPass
        }

        const {id, rolesNumbers} = await UsersRepository.addUser(new UsersRecord(newUser));

        res.status(201).json({
            "message": "Success! User created!",
            "response": 201,
            "id": id,
            "User": username,
            "roles": roles
        })
    } catch (err) {
        res.status(500).json({"message": `${err.message}`}); // 500 - Internal Server Error
    }
}

function createAccessToken(res, username, roles) {
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": username,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: JWT_ACCESS_TOKEN_TIME}
    )
    return {accessToken};
}

async function createRefreshToken(res, username, accessToken) {
    const refreshToken = jwt.sign(
        {"username": username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: JWT_REFRESH_TOKEN_TIME}
    );
    await UsersRepository.addRefreshToken(username, refreshToken);
    res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}).json(accessToken);
}

async function getRefreshToken(username) {
    return await UsersRepository.getRefreshTokenFromDatabase(username);
}

async function evaluateJWT(refreshToken, username, res) {
    const roles = await getRolesFromDatabase(username)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || username !== decoded.username) return res.sendStatus(403);
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
        });
}

module.exports = {
    checkUserNamePassword,
    checkRolesProvided,
    checkIfUserExists,
    checkPassword,
    getRolesFromDatabase,
    createNewUser,
    createAccessToken,
    createRefreshToken,
    getRefreshToken,
    evaluateJWT
}