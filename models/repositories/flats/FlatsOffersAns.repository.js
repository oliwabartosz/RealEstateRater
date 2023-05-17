const {v4: uuid} = require("uuid");

const {pool} = require("../../../config/dbConn");
const {FlatsRecordAns} = require("../../flats.record");

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
        const columns = Object.keys(record).filter(key => key !== 'number' && key !== 'updateDate')

        if (!(await FlatsOffersAnsRepository._checkId(getIdByNumber))) {
            await pool.execute(`INSERT INTO flats_ans (flatId, ${columns.join(", ")}) VALUES (:flatId, :technologyAns, :lawStatusAns, :elevatorAns, :basementAns, :garageAns, :gardenAns, :modernizationAns, :alarmAns, :kitchenAns, :outbuildingAns, :qualityAns, :rentAns, :commentsAns, :deleteAns, :rateStatus, :user)`, {
                flatId: getIdByNumber,
                ...record,
            });
            return 'added.'
        } else {
            await pool.execute(`UPDATE flats_ans SET technologyAns = :technologyAns, lawStatusAns = :lawStatusAns, elevatorAns = :elevatorAns, basementAns = :basementAns, garageAns = :garageAns, gardenAns = :gardenAns, modernizationAns = :modernizationAns, alarmAns = :alarmAns, kitchenAns = :kitchenAns, outbuildingAns = :outbuildingAns, qualityAns = :qualityAns, rentAns = :rentAns, commentsAns = :commentsAns, deleteAns = :deleteAns, rateStatus = :rateStatus, user = :user WHERE flatId = :flatId `, {
                flatId: getIdByNumber,
                ...record,
            });
            return 'updated.'
        }
    }
}
module.exports = {
    FlatsAnswersRepository: FlatsOffersAnsRepository,
}