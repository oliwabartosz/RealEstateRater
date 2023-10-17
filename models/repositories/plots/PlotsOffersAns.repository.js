const {v4: uuid} = require("uuid");

const {pool} = require("../../../config/dbConn");
const {updateToDatabase, addToDatabase} = require("./utils/plots-utils");
const {argsAns, argsPartialAns} = require("../../db_columns/plots");
const {PlotsRecordAns} = require("../../plots.record");
const {PLOTS_RECORD_FIELDS} = require("../../db_columns/plots");
const {PlotsOffersRepository} = require("./PlotsOffers.repository");

class PlotsAnswersRepository {
    static _checkRecord(record) {
        if (!(record instanceof PlotsRecordAns)) {
            throw new Error('record must be an instance of PlotsRecordAns')
        }
    }

    static async _checkId(id) {
        const [results] = await pool.execute('SELECT `plotId` FROM `plots_ans` WHERE `plotId` = :id', {
            id,
        });
        return results.length > 0;
    }

    // @TODO: add to TS.
    static async getAll() {
        const columns = Object.values(PLOTS_RECORD_FIELDS)
        const [results] = await pool.execute('SELECT `plots`.id, ' + columns + ' FROM `plots` JOIN `plots_ans` ON `plots`.id = `plots_ans`.plotId ORDER BY `plots`.`number` ASC');
        return results.map(result => new PlotsRecordAns(result));
    }

    static async insert(record) {

        PlotsAnswersRepository._checkRecord(record);
        const getIdByNumber = await PlotsOffersRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await PlotsAnswersRepository._checkId(getIdByNumber))) {
            await addToDatabase(record, 'plots_ans', argsAns)
            return 'added.'
        } else {
            await updateToDatabase(record, 'plots_ans', argsAns)
            return 'updated.'
        }
    }

    static async find(id) {

        const [results] = await pool.execute('SELECT * FROM `plots_ans` WHERE plotId = :id', {
            id,
        });
        return results.length === 1 ? new PlotsRecordAns(results[0]) : null;
    }

    static async insertPartials(record) {
        PlotsAnswersRepository._checkRecord(record);
        const getIdByNumber = await PlotsOffersRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        const { technologyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, commentsAns, id } = record

        const partialRecord = { technologyAns, elevatorAns, basementAns, garageAns, gardenAns, modernizationAns, alarmAns, kitchenAns,
            outbuildingAns, qualityAns, commentsAns, id }



        if (!(await PlotsAnswersRepository._checkId(getIdByNumber))) {
            await addToDatabase(partialRecord, 'plots_ans', argsPartialAns)
            return 'added.'
        } else {
            await updateToDatabase(partialRecord, 'plots_ans', argsPartialAns)
            return 'updated.'
        }
    }

}


module.exports = {
    PlotsAnswersRepository,
}