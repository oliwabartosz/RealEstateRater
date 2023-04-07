const {checkUserNamePassword, checkIfUserExists, createNewUser, checkRolesProvided} = require("./utils/registrationController");


const handleNewUser = async (req, res) => {
    // Check if user provided username and password
    if (checkUserNamePassword(req, res)) {
        return;
    }

    // Check if roles are correct - user can add roles ['user', 'api', 'admin']
    // If roles is empty Array or not provided, the 'user' role is set.
    if (checkRolesProvided(req, res)) {
        return;
    }

    // Check in database if username exists
    if (await checkIfUserExists(req, res)) {
        return;
    }

    await createNewUser(req, res);

}

module.exports = {
    handleNewUser
};