import {v4 as uuid} from "uuid";
import {pool} from "../../config/dbConn";
import {UsersRecord} from "../users.record";
import {Roles, ROLES} from "../../config/roles";
import {ValidationError} from "../../config/error";


export class UsersRepository {
    private static async assignRolesIntoDataBase(record: UsersRecord): Promise<number[]> {
        const { roles= [] } = record; // @TODO: check if this clever idea works instead of: let roles: string[] = record.roles ?? [];

        // Add basic role that every user should have
        if (!roles.includes('User')) {
            roles.push('User');
        }

        // Map role names to corresponding numbers for the 'users_roles' table.
        const roleMapping: { [key: string]: number } = {
            "User": Roles.User,
            "Api": Roles.Api,
            "Admin": Roles.Admin
        };

        const rolesNumbers: number[] = roles.map(role => roleMapping[role]);

        // Insert to the database roles for that user
        for (const role of rolesNumbers) {
            await pool.execute('INSERT INTO `users_roles` (`userId`, `roleId`) VALUES(:id, :role)', {
                id: record.id,
                role: role,
            });
        }

        return rolesNumbers;

    }

    public static async addUser(record: UsersRecord) {

        // Checking the length of username & password
        if (record.username.length < 3 || record.username.length > 25) {
            throw new ValidationError('Nazwa użytkownika powinna zawierać od 3 do 25 znaków.');
        }
        if (record.password.length < 5) {
            throw new ValidationError('Hasło musi zawierać więcej niż 5 znaków.');
        }

        record.id = record.id ?? uuid();

        await pool.execute('INSERT INTO `users` VALUES(:id, :username, :password, :refreshToken)', {
            id: record.id,
            username: record.username,
            password: record.password,
            refreshToken: record.refreshToken,
        });

        const roles = await UsersRepository.assignRolesIntoDataBase(record)

        // Return user specifics
        return {
            id: record.id,
            username: record.username,
            rolesNumber: roles,
            message: "User has been added."
        }
    }

    static async addRefreshToken(username: string, refreshToken: string): Promise<void> {
        await pool.execute('UPDATE `users` SET `refreshToken` = :refreshToken WHERE username = :username', {
            username: username,
            refreshToken: refreshToken
        });
    }

    static async delete(record: UsersRecord): Promise<void> {
        if (!record.id) {
            throw new Error('Users ID not provided.');
        }

        await pool.execute('DELETE FROM `users` WHERE id = :id', {
            id: record.id
        });
    }

    static async changePassword(record: UsersRecord) {
        if (!record.id) {
            throw new Error('Users ID not provided.');
        }

        //@TODO: bcrypt? hash?

        await pool.execute('UPDATE `users` SET `password` = :password WHERE id = :id', {
            id: record.id,
            password: record.password
        });
    }

    static async find(id: string) {

        const [results] = await pool.execute('SELECT `id`, `username`, `password`, `refreshToken` FROM `users` WHERE' +
            ' id = :id', {
            id: id,
        });
        return results.length === 1 ? new UsersRecord(results[0]) : null;
    }

    static async findUserByUsername(username: string) {
        const [results] = await pool.execute('SELECT `username` FROM `users` WHERE username = :username', {
            username: username
        });
        return results.length
    }

    static async getPasswordFromDatabase(username: string) {
        const [results] = await pool.execute('SELECT `password` FROM `users` WHERE username = :username', {
            username: username
        });

        return results.length === 1 ? new UsersRecord(results[0]) : null;
    }

    static async getRefreshTokenFromDatabase(refreshToken: string) {
        const [results] = await pool.execute('SELECT `username`, `refreshToken` FROM `users` WHERE `refreshToken` = :refreshToken', {
            refreshToken: refreshToken
        });

        return results.length === 1 ? new UsersRecord(results[0]) : null;
    }

    static async getRolesFromDatabase(username: string) {

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