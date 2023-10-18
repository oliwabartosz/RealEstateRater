import {v4 as uuid} from "uuid";
import {pool} from "../../../config/dbConn";
import {FlatsRecord} from "../../flats.record";
import {FLATS_RECORD_FIELDS, FLATS_RECORD_GPT} from "../../db_columns/flats";
import {FieldPacket} from "mysql2";
import {RealEstateRepository} from "../RealEstate.respository";

//@TODO: add this to general list of types in ./types/types
type FlatsOfferResults = [FlatsRecord[], FieldPacket[]];

export class FlatsOffersRepository extends RealEstateRepository {
    length: number;
    id: string;

    //@TODO: why the heck is this here?
    static async getAllDataForGPT() {
        const columns = Object.values(FLATS_RECORD_GPT).join(', ')
        const [results] = await pool.execute(
            'SELECT ' + columns + ' FROM `flats` LEFT JOIN `flats_GPT` ON `flats`.`id` = `flats_GPT`.`flatId` ORDER BY `flats`.`number` ASC');
        return results;
    }
}
