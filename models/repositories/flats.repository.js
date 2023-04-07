const {v4: uuid} = require("uuid");
const {pool} = require("../../config/dbConn");
const {FlatsRecord} = require("../flats.record");
const {flatsRecords} = require("../db_columns/flats");

class FlatsRepository {
    static _checkRecord(record) {
        if (!(record instanceof FlatsRecord)) {
            throw new Error('record must be an instance of FlatsRecord')
        }
    }

    static async _getLastNumber() {
        const [results] = await pool.execute('SELECT `number` FROM `flats` ORDER BY `number` DESC LIMIT 1;');
        return results[0].number;
    }
    static async insert(record) {
        FlatsRepository._checkRecord(record);
        record.id = record.id ?? uuid();

        const lastFlatNumber = await this._getLastNumber()
        if (parseInt(record.number) <= parseInt(lastFlatNumber)) {
            record.number = parseInt(lastFlatNumber) + 1
        }

        const values = Object.keys(record).map((key) => record[key]);
        console.log(values)
        const placeholders = Array(values.length).fill("?").join(", ");
        const sql = `INSERT INTO flats (${Object.keys(record).join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

    static async delete(record) {
        FlatsRepository._checkRecord(record);
        if (!record.id) {
            throw new Error('Todo has no ID.');
        }

        await pool.execute('DELETE FROM `todos` WHERE id = :id', {
            id: record.id
        });
    }

    static async update(record) {
        FlatsRepository._checkRecord(record)
        if (!record.id) {
            throw new Error('Todo has no ID.');
        }
        record._validate()
        await pool.execute('UPDATE `todos` SET `title` = :title WHERE id = :id', {
            id: record.id,
            title: record.title
        });
    }

    static async find(id) {

        const [results] = await pool.execute('SELECT * FROM `todos` WHERE id = :id', {
            id: id,
        });
        return results.length === 1 ? new TodoRecord(results[0]) : null;
    }

    static async findAll() {

        const [results] = await pool.execute('SELECT * FROM `todos`');
        return results.map(result => new TodoRecord(result));
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
    FlatsRepository,
}
