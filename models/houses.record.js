const {HOUSES_RECORD_FIELDS, HOUSES_RECORD_FIELDS_ANS, HOUSES_RECORD_GPT} = require("./db_columns/houses");


class HousesRecord {
    constructor(obj) {
        console.log(obj)

        this.id = obj.id;
        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(HOUSES_RECORD_FIELDS),

        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

class HousesRecordAns {
    constructor(obj) {

        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(HOUSES_RECORD_FIELDS_ANS)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

class HousesGPTRecord {
    constructor(obj) {
        const fields = [
            ...Object.values(HOUSES_RECORD_GPT)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}


module.exports = {
    HousesRecord,
    HousesRecordAns,
    HousesGPTRecord,
}