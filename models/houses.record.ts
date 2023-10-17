import {GenericRealEstateRecord} from "./generic.record";
import {
    HOUSES_RECORD_FIELDS,
    HOUSES_RECORD_FIELDS_ANS,
    HOUSES_RECORD_GPT
} from "./db_columns/houses";


export class HousesRecord extends GenericRealEstateRecord<HousesRecord> {
    public id: string;
    public number: string;

    constructor(obj: HousesRecord, recordFields: typeof HOUSES_RECORD_FIELDS) {
        super(obj, recordFields)

        this.id = obj.id;
        this.number = obj.number;
    }
}

export class HousesRecordAns extends GenericRealEstateRecord<HousesRecordAns> {
    public number: string;
    constructor(obj: HousesRecordAns, recordFields: typeof HOUSES_RECORD_FIELDS_ANS) {
        super(obj, recordFields)
        this.number = obj.number;
        }
}

export class HousesRecordGPT extends GenericRealEstateRecord<HousesRecordGPT> {
    constructor(obj: HousesRecordGPT, recordFields: typeof HOUSES_RECORD_GPT) {
        super(obj, recordFields)
    }
}