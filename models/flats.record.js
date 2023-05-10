const {FLATS_RECORD_FIELDS, FLATS_RECORD_FIELDS_ANS} = require("./db_columns/flats");


class FlatsRecord {
    constructor(obj) {
        this.id = obj.id;
        this.number = obj.number;

        // Other necessary keys to database, that can be null
        const fields = [
            ...Object.values(FLATS_RECORD_FIELDS),
            // ...Object.values(FLATS_RECORD_FIELDS_ANS)
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

module.exports = {
    FlatsRecord,
    FlatsRecordAns,
}