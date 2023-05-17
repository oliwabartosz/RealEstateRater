const {FLATS_RECORD_FIELDS, FLATS_RECORD_FIELDS_ANS, FLAT_GPT_COLUMNS, FLATS_RECORD_SHORT_ANS, FLATS_RECORD_GPT} = require("./db_columns/flats");


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

class FlatsShortAnsRecord {
    constructor(obj) {
        const fields = [
            ...Object.values(FLATS_RECORD_SHORT_ANS)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    }
}

const argsGPT = [
    "flatId", "technologyGPT", "lawStatusGPT", "elevatorGPT", "basementGPT", "garageGPT", "gardenGPT",
    "modernizationGPT", "alarmGPT", "kitchenGPT", "outbuildingGPT", "qualityGPT", "rentGPT", "commentsGPT"
];

module.exports = {
    FlatsRecord,
    FlatsRecordAns,
    FlatsGPTRecord,
    FlatsShortAnsRecord,
    argsGPT
}