const {v4: uuid} = require("uuid");
const {pool} = require("../../config/dbConn");
const {updateToDatabase, addToDatabase} = require("./flats/utils/flats-utils");
const {argsAns, argsPartialAns, argsTemplateGPT} = require("../db_columns/flats");
const {FlatsRepository} = require("./flats/FlatsOffers.repository");
const {TemplateGPTRecord} = require("../templateGPTRecord");

class TemplateGPTRepository {
    static _checkRecord(record) {
        if (!(record instanceof TemplateGPTRecord)) {
            throw new Error('record must be an instance of TemplateGPTRecord!')
        }
    };

    static async _checkId(id) {
        const [results] = await pool.execute('SELECT `flatId` FROM `templates_GPT` WHERE `flatId` = :id', {
            id,
        });
        return results.length > 0;
    }

    static async insert(record) {
        TemplateGPTRepository._checkRecord(record);
        const getIdByNumber = await FlatsRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await TemplateGPTRepository._checkId(getIdByNumber))) {
            await addToDatabase(record, 'templates_GPT', argsTemplateGPT)
            return 'added.'
        } else {
            await updateToDatabase(record, 'templates_GPT', argsTemplateGPT)
            return 'updated.'
        }
    }

}

module.exports = {
    TemplateGPTRepository,
}