const {v4: uuid} = require("uuid");

const {pool} = require("../../../config/dbConn");
const {FlatsRecordAns} = require("../../flats.record");
const {updateToDatabase, addToDatabase} = require("./utils/flats-utils");
const {argsShortAns, argsAns} = require("../../db_columns/flats");

class FlatsOffersAnsRepository {
    static _checkRecord(record) {
        if (!(record instanceof FlatsRecordAns)) {
            throw new Error('record must be an instance of FlatsRecordAns')
        }
    }
    static async _getId(number) {
        const [results] = await pool.execute('SELECT `id`, `number` FROM `flats` WHERE `number` = :number', {
            number,
        });

        if (results.length > 0) {
            return results[0].id;
        } else {
            throw new Error('There is no record with that id or number!')

        }
    }

    static async _checkId(id) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_ans` WHERE `flatId` = :id', {
            id,
        });
        return results.length > 0;
    }

    static async insert(record) {
        FlatsOffersAnsRepository._checkRecord(record);
        const getIdByNumber = await this._getId(record.number);
        record.id = getIdByNumber;

        if (!(await FlatsOffersAnsRepository._checkId(getIdByNumber))) {
            await addToDatabase(record, 'flats_ans', argsAns)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_ans', argsAns)
            return 'updated.'
        }
    }
}
module.exports = {
    FlatsAnswersRepository: FlatsOffersAnsRepository,
}