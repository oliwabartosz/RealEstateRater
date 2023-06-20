const {v4: uuid} = require("uuid");
const {pool} = require("../../../config/dbConn");
const {FlatsGPTRecord, FlatsRecord} = require("../../flats.record");
const {addToDatabase, updateToDatabase, checkIfExistsById} = require("./utils/flats-utils");
const {argsGPT} = require("../../db_columns/flats");

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

    static async insert(record) {
        FlatsGptOffersRepository._checkRecord(record);

        if (!(await checkIfExistsById('flats_GPT', record.id))) {
            await addToDatabase(record, 'flats_GPT', argsGPT);
            return 'added.'
        } else {
            await updateToDatabase(record, `flats_GPT`, argsGPT);
            return 'updated.'
        }
    }

    static async getAll() {

        const [results] = await pool.execute('SELECT * FROM `flats` ORDER BY `number` ASC');
        return results.map(result => new FlatsGPTRecord(result));
    }

    //
    //     if (!(await FlatsGptOffersRepository._checkIfExists(record.id))) {
    //         await pool.execute(`INSERT INTO flats_GPT (flatId, ${columns.join(", ")}) VALUES (:flatId, :technologyGPT, :lawStatusGPT, :elevatorGPT, :basementGPT, :garageGPT, :gardenGPT, :modernizationGPT, :alarmGPT, :kitchenGPT, :outbuildingGPT, :qualityGPT, :rentGPT, :commentsGPT)`, {
    //             flatId: record.id,
    //             ...record,
    //         });
    //         return 'added.'
    //
    //     } else {
    //         await pool.execute(`UPDATE flats_GPT SET technologyGPT = :technologyGPT, lawStatusGPT = :lawStatusGPT, elevatorGPT = :elevatorGPT, basementGPT = :basementGPT, garageGPT = :garageGPT, gardenGPT = :gardenGPT, modernizationGPT = :modernizationGPT, alarmGPT = :alarmGPT, kitchenGPT = :kitchenGPT, outbuildingGPT = :outbuildingGPT, qualityGPT = :qualityGPT, rentGPT = :rentGPT, commentsGPT = :commentsGPT WHERE flatId = :flatId `, {
    //             flatId: record.id,
    //             ...record,
    //         });
    //         return 'updated.'
    //     }
    // }
}

module.exports = {
    FlatsGPTRepository: FlatsGptOffersRepository,
}