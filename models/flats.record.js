const FLATS_RECORD_FIELDS = require("./db_columns/flats");
const {pool} = require("../config/dbConn");


class FlatsRecord {
    constructor(obj) {
        this.id = obj.id;
        this.number = obj.number;
        // Other necessary keys to database, that can be null
        for (const field of Object.values(FLATS_RECORD_FIELDS)) {
            this[field] = obj[field] ?? null
        }
        this._validate()
    }

     _validate() {
        // Some validation may be needed.
    }


}

module.exports = {
    FlatsRecord,
}