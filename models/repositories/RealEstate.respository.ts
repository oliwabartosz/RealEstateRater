import {pool} from "../../config/dbConn";
import {FlatsRecord, FlatsRecordAns, FlatsRecordGPT} from "../flats.record";
import {args, FLATS_RECORD_FIELDS, FLATS_RECORD_FIELDS_ANS, FLATS_RECORD_GPT} from "../db_columns/flats";
import {v4 as uuid} from "uuid";
import {addToDatabase, updateToDatabase} from "./utils/utils";

import {RealEstateRecord, RealEstateResults, RealEstateType} from "../../types";


export class RealEstateRepository {
    public sqlTable: string;
    private recordType: { sqlTable: string; baseSqlTable: string; sqlID?: string; fields: { [p: string]: string }; args?: string[]; argsPartials?: string[] };

    constructor(sql_table: RealEstateType) {
        this.sqlTable = sql_table;
        this.recordType = this.determineRecordType()
    }

    private determineRecordType(): {
        sqlTable: string;
        baseSqlTable: string;
        sqlID?: string;
        fields: { [p: string]: string };
        args?: string[];
        argsPartials?: string[];
    } {
        if (this.sqlTable === 'flats') {
            return {
                sqlTable: 'flats',
                baseSqlTable: 'flats',
                fields: FLATS_RECORD_FIELDS,
            }
        }
        if (this.sqlTable === 'flatsAns') {
            return {
                sqlTable: 'flats_ans',
                baseSqlTable: 'flats',
                sqlID: 'flatId',
                fields: FLATS_RECORD_FIELDS_ANS,
                args: args.argsAns,
                argsPartials: args.argsPartialAns
            }
        }
        if (this.sqlTable === 'flatsGPT') {
            return {
                sqlTable: 'flats_GPT',
                baseSqlTable: 'flats',
                sqlID: 'flatId',
                fields: FLATS_RECORD_GPT,
                args: args.argsGPT,
            }
        }
    }

    /**
     * This method creates instances based on Real Estate Type SQL Table.
     */
    createRecord(record: RealEstateRecord): RealEstateRecord {
        if (this.sqlTable === 'flats') {
            return new FlatsRecord(record, this.recordType.fields);
        }
        if (this.sqlTable === 'flatsAns') {
            return new FlatsRecordAns(record, this.recordType.fields);
        }
        if (this.sqlTable === 'flatsGPT') {
            return new FlatsRecordGPT(record, this.recordType.fields);
        }

    }

    /**
     * This method returns the first or last number. Set the parameter 'offerNumber' to 'first' or 'last'.
     * If something else is set, it will return the first number.
     * @param {'first' | 'last'} offerNumber - The first number to be added.
     * @returns {Promise<string> | null} A promise that resolves to the first or last number as a string or null.
     */
    async getFirstOrLastNumber(offerNumber: 'first' | 'last'): Promise<string> | null {
        let sequentialOrder: 'ASC' | 'DESC' = offerNumber === "last" ? 'DESC' : 'ASC';

        const [result] = await pool.execute(
            `SELECT number FROM ${this.sqlTable} ORDER BY number ${sequentialOrder} LIMIT 1;`) as RealEstateResults;

        return result.length > 0 ? String(result[0].number) : null;
    }

    /**
     * This method returns an id based on given number.
     * @param {string} number - the number of real estate in database as string.
     * @returns {Promise<string>} A promise that resolves to the id based on given id.
     */
    async getIdByNumber(number: string): Promise<string> {


        const [results] = await pool.execute(
            `SELECT id, number FROM ${this.recordType.baseSqlTable} WHERE number = :number`,
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

        if (this.recordType.sqlTable === 'flats') {
            sql = `SELECT * FROM ${this.sqlTable} ORDER BY number ASC`
        }
        if (this.recordType.sqlTable === 'flats_ans') {
            const columns = Object.values(FLATS_RECORD_FIELDS_ANS).join(', ')
            sql = 'SELECT `flats`.id, ' + columns + ' FROM `flats` JOIN `flats_ans` ON `flats`.id = `flats_ans`.flatId ORDER BY `flats`.`number` ASC';
        }
        if (this.recordType.sqlTable === 'flats_GPT') {
            const columns = Object.values(FLATS_RECORD_GPT).join(', ')
            sql = 'SELECT `flats`.id, ' + columns + ' FROM `flats` LEFT JOIN `flats_GPT` ON `flats`.`id` = `flats_GPT`.`flatId` ORDER BY `flats`.`number` ASC';
        }

        const [results] = await pool.execute(sql) as RealEstateResults;
        return results.map(result => this.createRecord(result));
    }

    private async checkId(id: string) {


        const [results] = await pool.execute(
            `SELECT ${this.recordType.sqlID} FROM ${this.recordType.sqlTable} WHERE flatId = :id`,
            {id}) as RealEstateResults;
        return results.length > 0;
    }

    /**
     * This method deletes the record from the database.
     */
    async delete(record: RealEstateRecord) {
        if (!record.id) throw new Error('Flat ID missing.');

        await pool.execute(`DELETE FROM flats WHERE id = :id`, {
            id: record.id
        });
    }

    /**
     * This method returns the record based on given number.
     */
    async findByNumber(number: string): Promise<RealEstateRecord> {
        const [results] = await pool.execute(
            `SELECT * FROM ${this.recordType.sqlTable} WHERE number = :number`, {
                number,
            }) as RealEstateResults;

        return results.length === 1 ? this.createRecord(results[0]) : null;
    }

    async findByID(id: string): Promise<RealEstateRecord> {

        const [results] = await pool.execute(
            `SELECT * FROM ${this.recordType.sqlTable} WHERE flatId = :id`, {
            id,
        }) as RealEstateResults;
        return results.length === 1 ? this.createRecord(results[0]) : null;
    }

    /**
     * This method inserts the data from Real Estate Scraper into database
     */
    async insertWebScrapedData(record: RealEstateRecord) {
        record.id = record.id ?? uuid();

        const lastFlatNumber = Number(await this.getFirstOrLastNumber('last'));
        record.number = String(lastFlatNumber + 1);

        const columns: string[] = Object.keys(record)
        const values: string[] = Object.keys(record).map((key) => record[key as keyof RealEstateRecord]);

        const placeholders = Array(columns.length).fill("?").join(", ");
        const sql = `INSERT INTO ${this.sqlTable} (${columns.join(", ")}) VALUES (${placeholders})`;

        await pool.execute(sql, values);

        return record.id
    }

    /**
     * This method inserts the data from Real Estate Scraper into database
     */
    async insertOrUpdateAnswers(record: RealEstateRecord) {

        const getIdByNumber = await this.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await this.checkId(getIdByNumber))) {
            await addToDatabase(record, this.recordType.sqlTable, this.recordType.sqlID, this.recordType.args)
            return 'added.'
        } else {
            await updateToDatabase(record, this.recordType.sqlTable, this.recordType.sqlID, this.recordType.args)
            return 'updated.'
        }
    }

    async insertPartials(record: RealEstateRecord) {
        const getIdByNumber = await this.getIdByNumber(record.number);
        record.id = getIdByNumber;

        if (!(await this.checkId(getIdByNumber))) {
            await addToDatabase(record, this.recordType.sqlTable, this.recordType.sqlID, this.recordType.argsPartials)
            return 'added.'
        } else {
            await updateToDatabase(record, this.recordType.sqlTable, this.recordType.sqlID, this.recordType.argsPartials)
            return 'updated.'
        }
    }
}