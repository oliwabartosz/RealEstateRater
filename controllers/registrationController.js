const {writeFile} = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const usersDb = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}

const handleNewUser = async (req, res) => {
    const {user, pass} = req.body;
    if (!user || !pass) return res.status(400).send('User and password are required.') // 400 - Bad request

    // Check if there is a duplicate in database
    const findDuplicate = usersDb.users.find(person => person.username === user);
    if (findDuplicate) return res.status(409); // 409 - Conflict
    try {
        // password encryption
        const hashedPass = await bcrypt.hash(pass, 10);
        //store the new user
        const newUser = {"username": user, "password": hashedPass}
        usersDb.setUsers([...usersDb.users, newUser])
        await writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDb.users)
        );
        console.log(usersDb.users);
        res.status(201).send(`Success! New user ${user} created!`) // 201 - Created
    } catch(err) {
        res.status(500).send(err.message) // 500 - Internal Server Error
    }
};

module.exports = {
    handleNewUser
};