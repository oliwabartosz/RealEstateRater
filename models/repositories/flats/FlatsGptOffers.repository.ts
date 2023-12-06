import {pool} from "../../../config/dbConn";
import {FlatsRecordGPT} from "../../flats.record";
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
}

