const {UsersRepository} = require("../../models/repositories/users.repository");
const bcrypt = require("bcrypt");
const {UsersRecord} = require("../../models/users.record");

function _convertRolesToProperFormat(req) {
    const roles = req.body.roles ?? [];
    if (!Array.isArray(roles)) {
        return null;
    }
    return Array.from(new Set(roles.map(role => role.toLowerCase())));
}

function checkUserNamePassword(req, res) {
    const {username, password} = req.body;

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

async function checkIfUserExists(req, res) {
    const {username} = req.body;

    const findDuplicate = await UsersRepository.findUserByUsername(username)
    if (findDuplicate === null) {
        res.status(409).json({
            "message": "Conflict",
            "response": 409
        });
        return true;
    }
    return false;
}


async function createNewUser(req, res) {
    const {username, password} = req.body;
    const roles = _convertRolesToProperFormat(req);

    try {
        // password encryption
        const hashedPass = await bcrypt.hash(String(password), 10);

        const newUser = {
            "username": username,
            "roles": roles,
            "refreshToken": null,
            "password": hashedPass
        }

        const {id, rolesNumbers} = await UsersRepository.addUser(new UsersRecord(newUser))
        console.log()

        res.status(201).json({
            "message": "Success! User created!",
            "response": 201,
            "id": id,
            "User": username,
            "roles": roles
        })
    } catch (err) {
        res.status(500).json({"message": `${err.message}`}) // 500 - Internal Server Error
    }
}

module.exports = {
    checkUserNamePassword,
    checkRolesProvided,
    checkIfUserExists,
    createNewUser
}