import {v4 as uuid} from "uuid";
import {pool} from "../../../config/dbConn";
import {FlatsRecord} from "../../flats.record";
import {FLATS_RECORD_FIELDS, FLATS_RECORD_GPT} from "../../db_columns/flats";
import {FieldPacket} from "mysql2";

//@TODO: add this to general list of types in ./types/types
type FlatsOfferResults = [FlatsRecord[], FieldPacket[]];

export class FlatsOffersRepository {
    length: number;
    id: string;

    static async getIdByNumber(number: string) {
        const [results] = await pool.execute('SELECT `id`, `number` FROM `flats` WHERE `number` = :number', {
            number,
        }) as FlatsOfferResults;

        if (results.length > 0) {
            return results[0].id;
        } else {
            throw new Error('There is no record with that id or number!')
        }
    }

    static async insert(record: FlatsRecord) {
        record.id = record.id ?? uuid();

        const lastFlatNumber = Number(await this.getLastNumber());
        record.number = String(lastFlatNumber + 1);

        const columns: string[] = Object.keys(record)
        const values: string[] = Object.keys(record).map((key) => record[key as keyof FlatsRecord]);

        const placeholders = Array(columns.length).fill("?").join(", ");
        const sql = `INSERT INTO flats (${columns.join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

    static async delete(record: FlatsRecord) {
        if (!record.id) {
            throw new Error('Flat ID missing.');
        }

        await pool.execute('DELETE FROM `flats` WHERE id = :id', {
            id: record.id
        });
    }

    static async find(number: string): Promise<FlatsRecord | null> {

        const [results] = await pool.execute('SELECT * FROM `flats` WHERE number = :number', {
            number,
        }) as FlatsOfferResults;
        return results.length === 1 ? new FlatsRecord(results[0], FLATS_RECORD_FIELDS) : null;
    }

    static async getAll() {

        const [results] = await pool.execute(
            'SELECT * FROM `flats` ORDER BY `number` ASC') as FlatsOfferResults;

        return results.map(result => new FlatsRecord(result, FLATS_RECORD_FIELDS));
    }

     static async getLastNumber(): Promise<string | null> {

        const [result] = await pool.execute(
            'SELECT `number` FROM `flats` ORDER BY `number` DESC LIMIT 1;') as FlatsOfferResults;

        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    static async getFirstNumber() {
        const [result] = await pool.execute(
            'SELECT `number` FROM `flats` ORDER BY `number` ASC LIMIT 1;') as FlatsOfferResults;
        if (result.length > 0) {
            return String(result[0].number);
        } else {
            return null;
        }
    }

    //@TODO: why the heck is this here?
    static async getAllDataForGPT() {
        const columns = Object.values(FLATS_RECORD_GPT).join(', ')
        const [results] = await pool.execute(
            'SELECT ' + columns + ' FROM `flats` LEFT JOIN `flats_GPT` ON `flats`.`id` = `flats_GPT`.`flatId` ORDER BY `flats`.`number` ASC');
        return results;
    }
}
