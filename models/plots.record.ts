import {GenericRealEstateRecord} from "./generic.record";
import {
    PLOTS_RECORD_FIELDS,
    PLOTS_RECORD_FIELDS_ANS,
    PLOTS_RECORD_GPT
} from "./db_columns/plots";

export class PlotsRecord extends GenericRealEstateRecord<PlotsRecord> {
    public id: string;
    public number: string;

    constructor(obj: PlotsRecord, recordFields: typeof PLOTS_RECORD_FIELDS) {
        super(obj, recordFields)

        this.id = obj.id;
        this.number = obj.number;
    }
}

export class PlotsRecordAns extends GenericRealEstateRecord<PlotsRecordAns>{
    public number: string;

    constructor(obj: PlotsRecordAns, recordFields: typeof PLOTS_RECORD_FIELDS_ANS) {
        super(obj, recordFields)

        this.number = obj.number;
    }
}

export class PlotsRecordGPT extends GenericRealEstateRecord<PlotsRecordAns> {
    constructor(obj: PlotsRecordAns, recordFields: typeof PLOTS_RECORD_GPT) {
        super(obj, recordFields)
    }
}
