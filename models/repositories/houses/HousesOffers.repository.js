const {v4: uuid} = require("uuid");
const {pool} = require("../../../config/dbConn");
const {HousesRecord} = require("../../houses.record");
const {HOUSES_RECORD_GPT} = require("../../db_columns/houses");

class HousesOffersRepository {
    static _checkRecord(record) {
        if (!(record instanceof HousesRecord)) {
            throw new Error('record must be an instance of HousesRecord')
        }
    }

    static async _getLastNumber() {
        const [results] = await pool.execute('SELECT `number` FROM `houses` ORDER BY `number` DESC LIMIT 1;');
        return results && results.length > 0 ? results[0].number : 0;
    }

    static async getIdByNumber(number) {
        console.log(number)

        const [results] = await pool.execute('SELECT `id`, `number` FROM `houses` WHERE `number` = :number', {
            number,
        });

        if (results.length > 0) {
            return results[0].id;
        } else {
            throw new Error('There is no record with that id or number!')
        }
    }


    static async insert(record) {
        HousesOffersRepository._checkRecord(record);
        record.id = record.id ?? uuid();

        const lastHouseNumber = await this._getLastNumber();
        record.number = lastHouseNumber + 1;

        const columns = Object.keys(record)
        const values = Object.keys(record).map((key) => record[key]);

        const placeholders = Array(columns.length).fill("?").join(", ");
        const sql = `INSERT INTO houses (${columns.join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

    static async delete(record) {
        HousesOffersRepository._checkRecord(record);
        if (!record.id) {
            throw new Error('House ID missing.');
        }

        await pool.execute('DELETE FROM `houses` WHERE id = :id', {
            id: record.id
        });
    }

    static async find(number) {

        const [results] = await pool.execute('SELECT * FROM `houses` WHERE number = :number', {
            number,
        });
        return results.length === 1 ? new HousesRecord(results[0]) : null;
    }

    static async getAll() {

        const [results] = await pool.execute('SELECT * FROM `houses` ORDER BY `number` ASC');
        return results.map(result => new HousesRecord(result));
    }

    static async getLastNumber() {
        const [result] = await pool.execute('SELECT `number` FROM `houses` ORDER BY `number` DESC LIMIT 1;');
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    static async getFirstNumber() {
        const [result] = await pool.execute('SELECT `number` FROM `houses` ORDER BY `number` ASC LIMIT 1;');
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }


    static async getAllDataForGPT() {
        const columns = Object.values(HOUSES_RECORD_GPT).join(', ')
        const [results] = await pool.execute('SELECT ' + columns + ' FROM `houses` LEFT JOIN `houses_GPT` ON `houses`.`id` = `houses_GPT`.`houseId` ORDER BY `houses`.`number` ASC');
        return results;
    }
}

module.exports = {
    HousesOffersRepository,
}
