const {checkUserNamePassword, checkIfUserExists, createNewUser, checkRolesProvided} = require("./utils/utils");
const {UsersRepository} = require("../models/repositories/users.repository");


const handleNewUser = async (req, res) => {
    const {username, password} = req.body;

    // Check if user provided username and password
    if (checkUserNamePassword(req, res, username, password)) {
        return;
    }

    // Checks if roles are correct - user can add roles ['user', 'api', 'admin']
    // If roles is empty Array or not provided, the 'user' role is set.
    if (checkRolesProvided(req, res)) {
        return;
    }

    // Checks if username exists in a database
    if (await checkIfUserExists(req, res, username, 0)) {
        return;
    }

    await createNewUser(req, res);

}

module.exports = {
    handleNewUser
};