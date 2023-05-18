const {pool} = require("../../../../config/dbConn");

// async function checkIfExistsById(sqlTable, id) {
//     const [results] = await pool.execute(`SELECT flatId FROM ${sqlTable} WHERE flatId = :id`, {
//         id,
//     });
//     return results.length > 0
// }

// ["flatId", "technologyGPT", "lawStatusGPT", "elevatorGPT", "basementGPT", "garageGPT", "gardenGPT", "modernizationGPT", "alarmGPT", "kitchenGPT", "outbuildingGPT", "qualityGPT", "rentGPT", "commentsGPT"]
async function addToDatabase(record, sqlTable, ...args) {
    console.log(record)
    const joinedArgs = args[0]
        .map(item => `:${item}`)
        .join(", "); // ":flatId, :technologyGPT, :lawStatusGPT..."

    const columns = Object.keys(record).filter(key => key !== 'id' && key !== 'updateDate' && key !== 'number')

    await pool.execute(`INSERT INTO ${sqlTable} (flatId, ${columns.join(", ")}) VALUES (${joinedArgs})`, {
        flatId: record.id,
        ...record,
    });
}

async function updateToDatabase(record, sqlTable, ...args) {

    const joinedArgs = args[0]
        .slice(1)
        .map(item => `${item} = :${item}`)
        .join(', '); // "technologyGPT = :technologyGPT, lawStatusGPT = :lawStatusGPT..."

    await pool.execute(`UPDATE ${sqlTable} SET ${joinedArgs} WHERE flatId = :flatId`, {
        flatId: record.id,
        ...record,
    });
}

module.exports = {
    addToDatabase,
    updateToDatabase,
    // checkIfExistsById,
}