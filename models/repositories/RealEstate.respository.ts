import {pool} from "../../config/dbConn";
import {FlatsRecord, FlatsRecordAns, FlatsRecordGPT} from "../flats.record";
import {FieldPacket} from "mysql2";
import {FLATS_RECORD_FIELDS, FLATS_RECORD_FIELDS_ANS, FLATS_RECORD_GPT} from "../db_columns/flats";
import {v4 as uuid} from "uuid";

type RealEstateResults = [FlatsRecord[] | FlatsRecordAns[] | FlatsRecordGPT[], FieldPacket[]];
type RealEstateRecord = FlatsRecord | FlatsRecordAns | FlatsRecordGPT
type RealEstateType = 'flats' | 'flatsAns' | 'flatsGPT' | 'houses' | 'housesAns' | 'housesGPT' | 'plots' | 'plotsAns' | 'plotsGPT'
export class RealEstateRepository {
    public static sql_table: string;

    constructor(sql_table: RealEstateType) {
        RealEstateRepository.sql_table = sql_table;
    }

    /**
     * This method creates instances based on Real Estate Type SQL Table.
     */
    static createRecord(record: RealEstateRecord): RealEstateRecord | Error {
        if (RealEstateRepository.sql_table === 'flats') {
            return new FlatsRecord(record, FLATS_RECORD_FIELDS);
        }
        if (RealEstateRepository.sql_table === 'flatsAns') {
            return new FlatsRecordAns(record, FLATS_RECORD_FIELDS_ANS);
        }
        if (RealEstateRepository.sql_table === 'flatsGPT') {
            return new FlatsRecordGPT(record, FLATS_RECORD_GPT);
        }
        // Handle other cases or return a default value
        throw new Error('Bad Record Instance Specified');
    }

    /**
     * This method returns the first or last number. Set the parameter 'offerNumber' to 'first' or 'last'.
     * If something else is set, it will return the first number.
     * @param {'first' | 'last'} offerNumber - The first number to be added.
     * @returns {Promise<string> | null} A promise that resolves to the first or last number as a string or null.
     */
    static async getFirstOrLastNumber(offerNumber: 'first' | 'last'): Promise<string> | null {
        let sequentialOrder: 'ASC' | 'DESC' = offerNumber === "last" ? 'DESC' : 'ASC';

        const [result] = await pool.execute(
            `SELECT number FROM ${RealEstateRepository.sql_table} ORDER BY number ${sequentialOrder} LIMIT 1;`) as RealEstateResults;

        return result.length > 0 ? String(result[0].number) : null;
    }

    /**
     * This method returns an id based on given number.
     * @param {string} number - the number of real estate in database as string.
     * @returns {Promise<string>} A promise that resolves to the id based on given id.
     */
    async getIdByNumber(number: string): Promise<string> {
        const [results] = await pool.execute(
            `SELECT id, number FROM ${RealEstateRepository.sql_table} WHERE number = :number`,
            {
                number,
            }) as RealEstateResults;

        if (results.length > 0) {
            return results[0].id;
        } else {
            throw new Error('There is no record with that id or number!')
        }
    }

    /**
     * This method returns the instance of specified class with all data in table.
     */
    async getAll() {
        let sql;

        if (RealEstateRepository.sql_table === 'flats') {
            sql = `SELECT * FROM ${RealEstateRepository.sql_table} ORDER BY number ASC`
        }
        if (RealEstateRepository.sql_table === 'flats_ans') {
            const columns = Object.values(FLATS_RECORD_FIELDS_ANS).join(', ')
            sql = 'SELECT `flats`.id, ' + columns + ' FROM `flats` JOIN `flats_ans` ON `flats`.id = `flats_ans`.flatId ORDER BY `flats`.`number` ASC';
        }
        if (RealEstateRepository.sql_table === 'flats_GPT') {
            const columns = Object.values(FLATS_RECORD_GPT).join(', ')
            sql = 'SELECT `flats`.id, ' + columns + ' FROM `flats` LEFT JOIN `flats_GPT` ON `flats`.`id` = `flats_GPT`.`flatId` ORDER BY `flats`.`number` ASC';
        }

        const [results] = await pool.execute(sql) as RealEstateResults;
        return results.map(result => RealEstateRepository.createRecord(result));
    }

    /**
     * This method deletes the record from the database.
     */
    static async delete(record: RealEstateRecord) {
        if (!record.id) throw new Error('Flat ID missing.');

        await pool.execute(`DELETE FROM flats WHERE id = :id`, {
            id: record.id
        });
    }

    /**
     * This method returns the record based on given number.
     */
    static async find(number: string) {
        const [results] = await pool.execute(
            `SELECT * FROM ${RealEstateRepository.sql_table} WHERE number = :number`, {
            number,
        }) as RealEstateResults;

        return results.length === 1 ? RealEstateRepository.createRecord(results[0]) : null;
    }

    static async insertWebScrapedData(record: RealEstateRecord) {
        record.id = record.id ?? uuid();

        const lastFlatNumber = Number(await RealEstateRepository.getFirstOrLastNumber('last'));
        record.number = String(lastFlatNumber + 1);

        const columns: string[] = Object.keys(record)
        const values: string[] = Object.keys(record).map((key) => record[key as keyof FlatsRecord]);

        const placeholders = Array(columns.length).fill("?").join(", ");
        const sql = `INSERT INTO ${RealEstateRepository.sql_table} (${columns.join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

}