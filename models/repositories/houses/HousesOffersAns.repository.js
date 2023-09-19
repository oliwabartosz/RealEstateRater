const {v4: uuid} = require("uuid");

const {pool} = require("../../../config/dbConn");
const {updateToDatabase, addToDatabase} = require("./utils/houses-utils");
const {argsAns, argsPartialAns} = require("../../db_columns/houses");
const {HousesOffersRepository} = require("./HousesOffers.repository");
const {HousesRecordAns} = require("../../houses.record");
const {HOUSES_RECORD_FIELDS_ANS} = require("../../db_columns/houses");

class HousesAnswersRepository {
    static _checkRecord(record) {
        if (!(record instanceof HousesRecordAns)) {
            throw new Error('record must be an instance of HousesRecordAns')
        }
    }

    static async _checkId(id) {
        const [results] = await pool.execute('SELECT `houseId` FROM `houses_ans` WHERE `houseId` = :id', {
            id,
        });
        return results.length > 0;
    }

    // @TODO: add to TS.
    static async getAll() {
        const columns = Object.values(HOUSES_RECORD_FIELDS_ANS)
        const [results] = await pool.execute('SELECT `houses`.id, ' + columns + ' FROM `houses` JOIN `houses_ans` ON `houses`.id = `houses_ans`.houseId ORDER BY `houses`.`number` ASC');
        return results.map(result => new HousesRecordAns(result));
    }

    static async insert(record) {

        HousesAnswersRepository._checkRecord(record);
        const getIdByNumber = await HousesOffersRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await HousesAnswersRepository._checkId(getIdByNumber))) {
            await addToDatabase(record, 'houses_ans', argsAns)
            return 'added.'
        } else {
            await updateToDatabase(record, 'houses_ans', argsAns)
            return 'updated.'
        }
    }

    static async find(id) {

        const [results] = await pool.execute('SELECT * FROM `houses_ans` WHERE houseId = :id', {
            id,
        });
        return results.length === 1 ? new HousesRecordAns(results[0]) : null;
    }

    static async insertPartials(record) {
        HousesAnswersRepository._checkRecord(record);
        const getIdByNumber = await HousesOffersRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        const { technologyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, commentsAns, id } = record

        const partialRecord = { technologyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, commentsAns, id }



        if (!(await HousesAnswersRepository._checkId(getIdByNumber))) {
            await addToDatabase(partialRecord, 'houses_ans', argsPartialAns)
            return 'added.'
        } else {
            await updateToDatabase(partialRecord, 'houses_ans', argsPartialAns)
            return 'updated.'
        }
    }

}


module.exports = {
    HousesAnswersRepository,
}