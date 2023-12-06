import {FlatsRecord, FlatsRecordAns, FlatsRecordGPT} from "../../models/flats.record";
import {FieldPacket} from "mysql2";

export type RealEstateRecord = FlatsRecord | FlatsRecordAns | FlatsRecordGPT
export type RealEstateResults = [FlatsRecord[] | FlatsRecordAns[] | FlatsRecordGPT[], FieldPacket[]];
export type RealEstateType =
    'flats'
    | 'flatsAns'
    | 'flatsGPT'
    | 'houses'
    | 'housesAns'
    | 'housesGPT'
    | 'plots'
    | 'plotsAns'
    | 'plotsGPT'