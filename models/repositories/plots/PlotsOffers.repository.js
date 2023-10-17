const {v4: uuid} = require("uuid");
const {pool} = require("../../../config/dbConn");
const {PlotsRecord} = require("../../plots.record");
const {PLOTS_RECORD_GPT} = require("../../db_columns/plots");

class PlotsOffersRepository {
    static _checkRecord(record) {
        if (!(record instanceof PlotsRecord)) {
            throw new Error('Record must be an instance of PlotsRecord')
        }
    }

    static async _getLastNumber() {
        const [results] = await pool.execute('SELECT `number` FROM `plots` ORDER BY `number` DESC LIMIT 1;');
        return results && results.length > 0 ? results[0].number : 0;
    }

    static async getIdByNumber(number) {
        const [results] = await pool.execute('SELECT `id`, `number` FROM `plots` WHERE `number` = :number', {
            number,
        });

        if (results.length > 0) {
            return results[0].id;
        } else {
            throw new Error('There is no record with that id or number!')
        }
    }


    static async insert(record) {
        PlotsOffersRepository._checkRecord(record);
        record.id = record.id ?? uuid();

        const lastPlotNumber = await this._getLastNumber();
        record.number = lastPlotNumber + 1;

        const columns = Object.keys(record)
        const values = Object.keys(record).map((key) => record[key]);

        const placeholders = Array(columns.length).fill("?").join(", ");
        const sql = `INSERT INTO plots (${columns.join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

    static async delete(record) {
        PlotsOffersRepository._checkRecord(record);
        if (!record.id) {
            throw new Error('Plot ID missing.');
        }

        await pool.execute('DELETE FROM `plots` WHERE id = :id', {
            id: record.id
        });
    }

    static async find(number) {

        const [results] = await pool.execute('SELECT * FROM `plots` WHERE number = :number', {
            number,
        });
        return results.length === 1 ? new PlotsRecord(results[0]) : null;
    }

    static async getAll() {

        const [results] = await pool.execute('SELECT * FROM `plots` ORDER BY `number` ASC');
        return results.map(result => new PlotsRecord(result));
    }

    static async getLastNumber() {
        const [result] = await pool.execute('SELECT `number` FROM `plots` ORDER BY `number` DESC LIMIT 1;');
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    static async getFirstNumber() {
        const [result] = await pool.execute('SELECT `number` FROM `plots` ORDER BY `number` ASC LIMIT 1;');
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    static async getAllDataForGPT() {
        const columns = Object.values(PLOTS_RECORD_GPT).join(', ')
        const [results] = await pool.execute('SELECT ' + columns + ' FROM `plots` LEFT JOIN `plots_GPT` ON `plots`.`id` = `plots_GPT`.`plotId` ORDER BY `plots`.`number` ASC');
        return results;
    }
}

module.exports = {
    PlotsOffersRepository,
}
