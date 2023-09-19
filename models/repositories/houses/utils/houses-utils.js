const {pool} = require("../../../../config/dbConn");

async function addToDatabase(record, sqlTable, ...args) {
    console.log('args[0]: ', args[0])
    const joinedArgs = args[0]
        .map(item => `:${item}`)
        .join(", "); // ":houseId, :technologyGPT, :lawStatusGPT..."

    const columns = Object.keys(record).filter(key => key !== 'id' && key !== 'updateDate' && key !== 'number')

    console.log(joinedArgs)
    await pool.execute(`INSERT INTO ${sqlTable} (houseId, ${columns.join(", ")}) VALUES (${joinedArgs})`, {
        houseId: record.id,
        ...record,
    });
}

async function updateToDatabase(record, sqlTable, ...args) {

    const joinedArgs = args[0]
        .slice(1)
        .map(item => `${item} = :${item}`)
        .join(', '); // "technologyGPT = :technologyGPT, lawStatusGPT = :lawStatusGPT..."

    await pool.execute(`UPDATE ${sqlTable} SET ${joinedArgs} WHERE houseId = :houseId`, {
        houseId: record.id,
        ...record,
    });
}

module.exports = {
    addToDatabase,
    updateToDatabase,
}