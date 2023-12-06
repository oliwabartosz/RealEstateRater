import {pool} from "../../../config/dbConn";
import {RealEstateRecord} from "../../../types";

export async function addToDatabase(record: RealEstateRecord, sqlTable: string, sqlID: string, ...sqlColumns: [string[]]) {
    const values = typescriptObjectWorkaround(record, [sqlColumns[0]], sqlID)


    const sqlCols = Object.keys(values).sort().join(", ")
    const sqlVals = Object.keys(values).sort().map((item: string) => `:${item}`)

    await pool.execute(`INSERT INTO ${sqlTable} (${sqlCols}) VALUES (${sqlVals})`, {
        ...values
    });
}

export async function updateToDatabase(record: RealEstateRecord, sqlTable: string, sqlID: string, ...sqlColumns: [string[]]) {
    const joinedArgs = sqlColumns[0]
        .slice(1)
        .map(item => `${item} = :${item}`)
        .join(', '); // "technologyGPT = :technologyGPT, lawStatusGPT = :lawStatusGPT..."

    const values = typescriptObjectWorkaround(record, sqlColumns, sqlID)

    await pool.execute(`UPDATE ${sqlTable} SET ${joinedArgs} WHERE flatId = :flatId`, {...values});
}

function typescriptObjectWorkaround(record: RealEstateRecord, arr: [string[]], sqlID: string) {
    // values in mysql2 was ...record, but I had to make a workaround

    const output: { [key: string]: any } = {};

    arr[0].slice(1).forEach(column => {
        output[column] = record[column as keyof RealEstateRecord];
    });

    for (const key in output) {
        if (output[key] === undefined) {
            delete output[key];
        }
    }

    output[sqlID] = record.id;

    return output
}