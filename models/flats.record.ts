import {GenericRealEstateRecord} from "./generic.record";

import {
    FLATS_RECORD_FIELDS,
    FLATS_RECORD_FIELDS_ANS,
    FLATS_RECORD_GPT,
} from "./db_columns/flats";


export class FlatsRecord extends GenericRealEstateRecord<FlatsRecord> {
    offerIdExpected: string;
    rateStatus: string;
    constructor(obj: FlatsRecord, recordFields: typeof FLATS_RECORD_FIELDS) {
        super(obj, recordFields)
        this.id = obj.id;
        this.number = obj.number;
    }
}

export class FlatsRecordAns extends GenericRealEstateRecord<FlatsRecordAns> {
    offerIdExpected: string;
    rateStatus: string;

    constructor(obj: FlatsRecordAns, recordFields: typeof FLATS_RECORD_FIELDS_ANS) {
        super(obj, recordFields)
        this.id = obj.id;
        this.number = obj.number;
    }
}

export class FlatsRecordGPT extends GenericRealEstateRecord<FlatsRecordGPT> {
    offerIdExpected: string;
    rateStatus: string;
    constructor(obj: FlatsRecordGPT, recordFields: typeof FLATS_RECORD_GPT) {
        super(obj, recordFields)
    }
}