const {v4: uuid} = require("uuid");
const {pool} = require("../../../config/dbConn");
const {FlatsGPTRecord, FlatsRecord, FlatsRecordAns} = require("../../flats.record");
const {addToDatabase, updateToDatabase, checkIfExistsById} = require("./utils/flats-utils");
const {argsGPT, argsAns} = require("../../db_columns/flats");
const {FlatsAnswersRepository} = require("./FlatsOffersAns.repository");
const {FlatsRepository} = require("./FlatsOffers.repository");

class FlatsGptOffersRepository {

    static _checkRecord(record) {
        if (!(record instanceof FlatsGPTRecord)) {
            throw new Error('record must be an instance of FlatsRecordAns')
        }
    }

    static async _checkIfExists(id) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_GPT` WHERE `flatId` = :id', {
            id,
        });
        return results.length > 0
    }

    static async _checkId(id) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_GPT` WHERE `flatId` = :id', {
            id,
        });
        return results.length > 0;
    }


    static async insert(record) {
        // @TODO - to będzie do parse jSON
        FlatsGptOffersRepository._checkRecord(record);
        const getIdByNumber = await FlatsRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;
        console.log(record)

        if (!(await FlatsGptOffersRepository._checkId(getIdByNumber))) {
            await addToDatabase(record, 'flats_GPT', argsGPT)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_GPT', argsGPT)
            return 'updated.'
        }
    }

    static async getAll() {

        const [results] = await pool.execute('SELECT * FROM `flats` ORDER BY `number` ASC');
        return results.map(result => new FlatsGPTRecord(result));
    }

    static async find(id) {

        const [results] = await pool.execute('SELECT * FROM `flats_GPT` WHERE flatId = :id', {
            id,
        });
        return results.length === 1 ? new FlatsGPTRecord(results[0]) : null;
    }
}

module.exports = {
    FlatsGPTRepository: FlatsGptOffersRepository,
}