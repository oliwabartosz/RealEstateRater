import {args} from "../../db_columns/flats";
import {pool} from "../../../config/dbConn";
import {FlatsRecordGPT} from "../../flats.record";
import {addToDatabase, updateToDatabase} from "../utils/utils";
import {FieldPacket} from "mysql2";

//@TODO: add this to general list of types in ./types/types
type FlatsGPTResults = [FlatsRecordGPT[], FieldPacket[]]

export class FlatsRepositoryGPT {
    length: number;

    static async checkIfExists(id: string) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_GPT` WHERE `flatId` = :id', {
            id,
        }) as FlatsRepositoryGPT[];
        return results.length > 0
    }

    private static async checkId(id: string) {
        const [results] = await pool.execute('SELECT `flatId` FROM `flats_GPT` WHERE `flatId` = :id', {
            id,
        }) as FlatsRepositoryGPT[];
        return results.length > 0;
    }

    static async insert(record: FlatsRecordGPT) {
        // @TODO - to będzie do parse jSON

        if (!(await FlatsRepositoryGPT.checkId(record.id))) {
            await addToDatabase(record, 'flats_GPT', args.argsGPT)
            return 'added.'
        } else {
            await updateToDatabase(record, 'flats_GPT', args.argsGPT)
            return 'updated.'
        }
    }

    static async getAll() {
        const [results] = await pool.execute('SELECT * FROM `flats` ORDER BY `number` ASC') as FlatsGPTResults;
        return results.map(result => {
            return new FlatsRecordGPT(result, {});
        });
    }

    static async find(id: string) {
        const [results] = await pool.execute('SELECT * FROM `flats_GPT` WHERE flatId = :id', {
            id,
        }) as FlatsGPTResults;
        return results.length === 1 ? new FlatsRecordGPT(results[0], {}) : null;
    }
}

