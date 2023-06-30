const {TEMPLATE_GPT_RECORD} = require("./db_columns/flats")

class TemplateGPTRecord {
    constructor(obj) {
        const fields = [
            ...Object.values(TEMPLATE_GPT_RECORD)
        ];
        for (const field of fields) {
            this[field] = obj[field] ?? null;
        }
    };
}

module.exports = {
    TemplateGPTRecord,
}