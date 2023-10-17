const {pool} = require("../../../../config/dbConn");

async function addToDatabase(record, sqlTable, ...args) {
    console.log('args[0]: ', args[0])
    const joinedArgs = args[0]
        .map(item => `:${item}`)
        .join(", ");

    const columns = Object.keys(record).filter(key => key !== 'id' && key !== 'updateDate' && key !== 'number')

    console.log(joinedArgs)
    await pool.execute(`INSERT INTO ${sqlTable} (plotId, ${columns.join(", ")}) VALUES (${joinedArgs})`, {
        plotId: record.id,
        ...record,
    });
}

async function updateToDatabase(record, sqlTable, ...args) {

    const joinedArgs = args[0]
        .slice(1)
        .map(item => `${item} = :${item}`)
        .join(', ');

    await pool.execute(`UPDATE ${sqlTable} SET ${joinedArgs} WHERE plotId = :plotId`, {
        plotId: record.id,
        ...record,
    });
}

module.exports = {
    addToDatabase,
    updateToDatabase,
}