import {FlatsRecordAns} from "../../flats.record";
import {FlatsOffersRepository} from "./FlatsOffers.repository";
import {FieldPacket} from "mysql2";
import {addToDatabase, updateToDatabase} from "../utils/utils";
import {pool} from "../../../config/dbConn";
import {args, FLATS_RECORD_FIELDS_ANS} from "../../db_columns/flats";

type FlatsAnsOfferResults = [FlatsRecordAns[], FieldPacket[]];

export class FlatsAnswersRepository {
    private static async checkId(id: string) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_ans` WHERE `flatId` = :id', {
            id,
        }) as FlatsAnsOfferResults;
        return results.length > 0;
    }

    static async getAll() {
        const columns = Object.values(FLATS_RECORD_FIELDS_ANS)
        const [results] = await pool.execute(
            'SELECT `flats`.id, ' + columns + ' FROM `flats` JOIN `flats_ans` ON `flats`.id = `flats_ans`.flatId ORDER BY `flats`.`number` ASC') as FlatsAnsOfferResults;
        return results.map(result => new FlatsRecordAns(result, {}));
    }

    static async insert(record: FlatsRecordAns) {

        const getIdByNumber = await FlatsOffersRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await FlatsAnswersRepository.checkId(getIdByNumber))) {
            await addToDatabase(record, 'flats_ans', args.argsAns)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_ans', args.argsAns)
            return 'updated.'
        }
    }

    static async find(id: string) {

        const [results] = await pool.execute('SELECT * FROM `flats_ans` WHERE flatId = :id', {
            id,
        }) as FlatsAnsOfferResults;
        return results.length === 1 ? new FlatsRecordAns(results[0], {}) : null;
    }

    static async insertPartials(record: FlatsRecordAns) {

        const getIdByNumber = await FlatsOffersRepository.getIdByNumber(record.number);
        record.id = getIdByNumber;

        //@TODO: czy id powinno być w argsPartial?

        if (!(await FlatsAnswersRepository.checkId(getIdByNumber))) {
            await addToDatabase(record, 'flats_ans', args.argsPartial)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_ans', args.argsPartial)
            return 'updated.'
        }
    }

}