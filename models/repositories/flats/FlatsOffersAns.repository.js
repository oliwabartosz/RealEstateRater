const {v4: uuid} = require("uuid");

const {pool} = require("../../../config/dbConn");
const {FlatsRecordAns} = require("../../flats.record");
const {updateToDatabase, addToDatabase} = require("./utils/flats-utils");
const {argsAns, argsPartialAns, FLATS_RECORD_FIELDS_ANS} = require("../../db_columns/flats");
const {FlatsRepository} = require("./FlatsOffers.repository");

class FlatsAnswersRepository {
    static _checkRecord(record) {
        if (!(record instanceof FlatsRecordAns)) {
            throw new Error('record must be an instance of FlatsRecordAns')
        }
    }

    static async _checkId(id) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_ans` WHERE `flatId` = :id', {
            id,
        });
        return results.length > 0;
    }

    // @TODO: add to TS.
    static async getAll() {
        const columns = Object.values(FLATS_RECORD_FIELDS_ANS)
        const [results] = await pool.execute('SELECT `flats`.id, ' + columns + ' FROM `flats` JOIN `flats_ans` ON `flats`.id = `flats_ans`.flatId ORDER BY `flats`.`number` ASC');
        return results.map(result => new FlatsRecordAns(result));
    }

    static async insert(record) {

        FlatsAnswersRepository._checkRecord(record);
        const getIdByNumber = await FlatsRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await FlatsAnswersRepository._checkId(getIdByNumber))) {
            await addToDatabase(record, 'flats_ans', argsAns)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_ans', argsAns)
            return 'updated.'
        }
    }

    static async find(id) {

        const [results] = await pool.execute('SELECT * FROM `flats_ans` WHERE flatId = :id', {
            id,
        });
        return results.length === 1 ? new FlatsRecordAns(results[0]) : null;
    }

    static async insertPartials(record) {
        FlatsAnswersRepository._checkRecord(record);
        const getIdByNumber = await FlatsRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        const { technologyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, commentsAns, id } = record

        const partialRecord = { technologyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, commentsAns, id }



        if (!(await FlatsAnswersRepository._checkId(getIdByNumber))) {
            await addToDatabase(partialRecord, 'flats_ans', argsPartialAns)
            return 'added.'
        } else {
            await updateToDatabase(partialRecord, 'flats_ans', argsPartialAns)
            return 'updated.'
        }
    }

}


module.exports = {
    FlatsAnswersRepository,
}