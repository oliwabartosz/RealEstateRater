const {v4: uuid} = require("uuid");
const {pool} = require("../../../config/dbConn");
const {FlatsRecord} = require("../../flats.record");
const {FLAT_GPT_COLUMNS, FLATS_RECORD_GPT} = require("../../db_columns/flats");

class FlatsOffersRepository {
    static _checkRecord(record) {
        if (!(record instanceof FlatsRecord)) {
            throw new Error('record must be an instance of FlatsRecord')
        }
    }

    static async _getLastNumber() {
        const [results] = await pool.execute('SELECT `number` FROM `flats` ORDER BY `number` DESC LIMIT 1;');
        return results && results.length > 0 ? results[0].number : 0;
    }

    static async getIdByNumber(number) {
        console.log(number)

        const [results] = await pool.execute('SELECT `id`, `number` FROM `flats` WHERE `number` = :number', {
            number,
        });

        if (results.length > 0) {
            return results[0].id;
        } else {
            throw new Error('There is no record with that id or number!')

        }
    }


    static async insert(record) {
        FlatsOffersRepository._checkRecord(record);
        record.id = record.id ?? uuid();

        const lastFlatNumber = await this._getLastNumber();
        record.number = lastFlatNumber + 1;

        const columns = Object.keys(record)
        const values = Object.keys(record).map((key) => record[key]);

        const placeholders = Array(columns.length).fill("?").join(", ");
        const sql = `INSERT INTO flats (${columns.join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

    static async delete(record) {
        FlatsOffersRepository._checkRecord(record);
        if (!record.id) {
            throw new Error('Flat ID missing.');
        }

        await pool.execute('DELETE FROM `flats` WHERE id = :id', {
            id: record.id
        });
    }

    static async find(number) {

        const [results] = await pool.execute('SELECT * FROM `flats` WHERE number = :number', {
            number,
        });
        return results.length === 1 ? new FlatsRecord(results[0]) : null;
    }
    static async getAll() {

        const [results] = await pool.execute('SELECT * FROM `flats` ORDER BY `number` ASC');
        return results.map(result => new FlatsRecord(result));
    }
    static async getLastNumber() {
        const [result] = await pool.execute('SELECT `number` FROM `flats` ORDER BY `number` DESC LIMIT 1;');
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    static async getFirstNumber() {
        const [result] = await pool.execute('SELECT `number` FROM `flats` ORDER BY `number` ASC LIMIT 1;');
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    static async getAllDataForGPT() {
        const columns = Object.values(FLATS_RECORD_GPT).join(', ')
        const [results] = await pool.execute('SELECT ' + columns +  ' FROM `flats` LEFT JOIN `flats_GPT` ON `flats`.`id` = `flats_GPT`.`flatId` ORDER BY `flats`.`number` ASC');
        return results;
    }

}

module.exports = {
    FlatsRepository: FlatsOffersRepository,
}
