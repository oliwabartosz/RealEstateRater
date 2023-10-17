import {pool} from "../../../../config/dbConn";

//@TODO: delete that file after checking
export async function addToDatabase(record: { [key: string]: string }, sqlTable: string, ...sqlColumns: [string[]]) {
    const joinedArgs: string = sqlColumns[0] // ['flatId', 'technologyGPT','technology_summary', 'lawStatusGPT'...]
        .map((item: string) => `:${item}`)
        .join(", "); // ":flatId, :technologyGPT, :lawStatusGPT..."

    const columns = Object.keys(record).filter(key => key !== 'id' && key !== 'updateDate' && key !== 'number')

    await pool.execute(`INSERT INTO ${sqlTable} (flatId, ${columns.join(", ")}) VALUES (${joinedArgs})`, {
        flatId: record.id,
        ...record,
    });
}

export async function updateToDatabase(record: { [key: string]: string }, sqlTable: string, ...sqlColumns: [string[]]) {
    const joinedArgs = sqlColumns[0]
        .slice(1)
        .map(item => `${item} = :${item}`)
        .join(', '); // "technologyGPT = :technologyGPT, lawStatusGPT = :lawStatusGPT..."

    await pool.execute(`UPDATE ${sqlTable} SET ${joinedArgs} WHERE flatId = :flatId`, {
        flatId: record.id,
        ...record,
    });
}