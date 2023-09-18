import {args, argsAns, argsGPT} from "../../db_columns/flats";
import {v4 as uuid} from "uuid";
import {pool} from "../../../config/dbConn";
const {FlatsGPTRecord, FlatsRecord, FlatsRecordAns} = require("../../flats.record");
const {addToDatabase, updateToDatabase, checkIfExistsById} = require("./utils/flats-utils");

const {FlatsAnswersRepository} = require("./FlatsOffersAns.repository");
const {FlatsRepository} = require("./FlatsOffers.repository");

class FlatsGPTRepository {

    private static checkRecord(record) {
        if (!(record instanceof FlatsGPTRecord)) {
            throw new Error('record must be an instance of FlatsRecordAns')
        }
    }

    static async checkIfExists(id: string) {
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
        FlatsGPTRepository.checkRecord(record);
        console.log(record)

        if (!(await FlatsGPTRepository._checkId(record.id))) {
            await addToDatabase(record, 'flats_GPT', args.argsGPT)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_GPT', args.argsAns)
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
    FlatsGPTRepository,
}