const {pool} = require("../../../../config/dbConn");

export async function addToDatabase(record, sqlTable, ...sqlColumns: string[]) {
    const joinedArgs = sqlColumns[0] // ['flatId', 'technologyGPT','technology_summary', 'lawStatusGPT'...]
        .map(item => `:${item}`)
        .join(", "); // ":flatId, :technologyGPT, :lawStatusGPT..."

    const columns = Object.keys(record).filter(key => key !== 'id' && key !== 'updateDate' && key !== 'number')

    await pool.execute(`INSERT INTO ${sqlTable} (flatId, ${columns.join(", ")}) VALUES (${joinedArgs})`, {
        flatId: record.id,
        ...record,
    });
}

export async function updateToDatabase(record, sqlTable, ...sqlColumns: string[]) {

    const joinedArgs = sqlColumns[0] //@TODO: ? [0]
        .slice(1)
        .map(item => `${item} = :${item}`)
        .join(', '); // "technologyGPT = :technologyGPT, lawStatusGPT = :lawStatusGPT..."

    await pool.execute(`UPDATE ${sqlTable} SET ${joinedArgs} WHERE flatId = :flatId`, {
        flatId: record.id,
        ...record,
    });
}