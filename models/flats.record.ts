import {
    FLATS_RECORD_FIELDS,
    FLATS_RECORD_FIELDS_ANS,
    FLATS_RECORD_GPT,
} from "./db_columns/flats";

class FlatsRecord {
    constructor(obj) {
        console.log('hahahahahahah', obj)

        this.id = obj.id;
        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(FLATS_RECORD_FIELDS),

        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

class FlatsRecordAns {
    constructor(obj) {

        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(FLATS_RECORD_FIELDS_ANS)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

class FlatsGPTRecord {
    constructor(obj) {
        const fields = [
            ...Object.values(FLATS_RECORD_GPT)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}


module.exports = {
    FlatsRecord,
    FlatsRecordAns,
    FlatsGPTRecord,
}