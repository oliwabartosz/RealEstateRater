const {v4: uuid} = require("uuid");
const {pool} = require("../../config/dbConn");
const {UsersRecord} = require("../users.record");

class UsersRepository {
    static _checkRecord(record) {
        if (!(record instanceof UsersRecord)) {
            throw new Error('record must be an instance of UsersRecord')
        }
    }

    static async addUser(record) {
        // Check record validity
        UsersRepository._checkRecord(record);

        // Assign ID if not provided
        record.id = record.id ?? uuid();

        await pool.execute('INSERT INTO `users` VALUES(:id, :username, :password, :refreshToken)', {
            id: record.id,
            username: record.username,
            password: record.password,
            refreshToken: record.refreshToken,
        });

        // Assign default role of 'user' if none provided
        let roles = record.roles ?? [];
        if (!roles.includes('user')) {
            roles.push('user');
        }

        // Map role names to corresponding numbers for the 'users_roles' table
        const rolesNumbersMapping = {'user': 1, 'api': 2, 'admin': 3};
        const rolesNumbers = roles.map(role => rolesNumbersMapping[role]);

        // INSERT INTO `users_roles` (`userId`, `roleId`) VALUES (:userId, :roleId)`
        for (const role of rolesNumbers) {
            await pool.execute('INSERT INTO `users_roles` (`userId`, `roleId`) VALUES(:id, :role)', {
                id: record.id,
                role: role,
            });
        }

        // Return user specifics
        return {
            id: record.id,
            username: record.username,
            roles: roles
        }
    }

    static async addRefreshToken(username, refreshToken) {
        await pool.execute('UPDATE `users` SET `refreshToken` = :refreshToken WHERE username = :username', {
            username: username,
            refreshToken: refreshToken
        });
    }

    static async delete(record) {
        UsersRepository._checkRecord(record);
        if (!record.id) {
            throw new Error('Users ID not provided.');
        }

        await pool.execute('DELETE FROM `users` WHERE id = :id', {
            id: record.id
        });
    }

    static async changePassword(record) {
        UsersRepository._checkRecord(record)
        if (!record.id) {
            throw new Error('Users ID not provided.');
        }
        record._validate()
        await pool.execute('UPDATE `users` SET `password` = :password WHERE id = :id', {
            id: record.id,
            password: record.password
        });
    }

    static async find(id) {

        const [results] = await pool.execute('SELECT `id`, `username`, `password`, `refreshToken` FROM `users` WHERE' +
            ' id = :id', {
            id: id,
        });
        return results.length === 1 ? new UsersRecord(results[0]) : null;
    }

    static async findUserByUsername(username) {
        const [results] = await pool.execute('SELECT `username` FROM `users` WHERE username = :username', {
            username: username
        });
        return results.length
    }

    static async getPasswordFromDatabase(username) {
        const [results] = await pool.execute('SELECT `password` FROM `users` WHERE username = :username', {
            username: username
        });

        return results.length === 1 ? new UsersRecord(results[0]) : null;
    }

    static async getRefreshTokenFromDatabase(refreshToken) {
        const [results] = await pool.execute('SELECT `username`, `refreshToken` FROM `users` WHERE `refreshToken` = :refreshToken', {
            refreshToken: refreshToken
        });

        return results.length === 1 ? new UsersRecord(results[0]) : null;
    }

    static async getRolesFromDatabase(username) {

        const [results] = await pool.execute('SELECT DISTINCT `users`.`username`, `roles`.`id`, roles.`userRole`' +
            ' FROM `users` JOIN `users_roles` ON `users`.`id` = `users_roles`.`userId` JOIN `roles` ON' +
            ' `users_roles`.`roleId` WHERE `users`.`username` = :username', {
            username: username
        });

        const resultsIdArray = results.map(obj => obj.id)

        return results.length > 0 ? resultsIdArray : null;
    }

    static async findAll() {

        const [results] = await pool.execute('SELECT `id`, `username` FROM `users`');
        return results.map(result => new UsersRecord(result));
    }

}

module.exports = {
    UsersRepository,
}
