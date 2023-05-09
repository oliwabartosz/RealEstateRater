const {v4: uuid} = require("uuid");
const {pool} = require("../../config/dbConn");
const {FlatsRecord} = require("../flats.record");
const {flatsRecords} = require("../db_columns/flats");

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
    static async findAll() {

        const [results] = await pool.execute('SELECT * FROM `flats`');
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
}

module.exports = {
    FlatsRepository: FlatsOffersRepository,
}
