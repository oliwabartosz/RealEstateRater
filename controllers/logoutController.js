const {writeFile} = require('fs').promises;
const path = require('path');

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) {
        this.users = data
    }
}

const handleLogout = async (req, res) => {
    // @TODO: Delete accessToken on client (front-end)

    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)  // 204 - No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in DB
    const foundUser = usersDb.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStatus(204) // 204 - No content
    }
    // Delete refreshToken from DB
    const otherUsers = usersDb.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''};
    usersDb.setUsers([...otherUsers, currentUser]);
    await writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDb.users)
    )
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(204)
}
module.exports = {
    handleLogout
}