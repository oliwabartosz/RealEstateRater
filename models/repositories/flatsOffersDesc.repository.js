const {v4: uuid} = require("uuid");
const {pool} = require("../../config/dbConn");
const {FlatsRecord} = require("../flats.record");
const {flatsRecords} = require("../db_columns/flats");

class FlatsOffersDescRepository {
    static _checkRecord(record) {
        if (!(record instanceof FlatsRecord)) {
            throw new Error('record must be an instance of FlatsRecord')
        }
    }

    static async insert(record) {
        FlatsOffersDescRepository._checkRecord(record);
        if (!record.id) {
            throw new Error('Flat ID missing.');
        }

        const values = Object.keys(record).map((key) => record[key]);
        const placeholders = Array(values.length).fill("?").join(", ");
        const sql = `INSERT INTO flats_desc (${Object.keys(record).join(", ")}) VALUES (${placeholders}) WHERE id = :id`;

        await pool.execute(sql, values, {
            id: record.id
        });
    }


}
