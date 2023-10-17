const {PLOTS_RECORD_FIELDS, PLOTS_RECORD_FIELDS_ANS, PLOTS_RECORD_GPT} = require("./db_columns/plots");


class PlotsRecord {
    constructor(obj) {
        console.log(obj)

        this.id = obj.id;
        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(PLOTS_RECORD_FIELDS),
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

class PlotsRecordAns {
    constructor(obj) {

        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(PLOTS_RECORD_FIELDS_ANS)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

class PlotsGPTRecord {
    constructor(obj) {
        const fields = [
            ...Object.values(PLOTS_RECORD_GPT)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}


module.exports = {
    PlotsRecord,
    PlotsRecordAns,
    PlotsGPTRecord,
}