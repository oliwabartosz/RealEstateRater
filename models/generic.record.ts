export class GenericRealEstateRecord<T> {

    // Necessary keys (without id, number) to database, that can be null
    constructor(obj: T, recordFields: { [key: string]: string }) {
        for (const field of Object.keys(recordFields)) {
            (this as any)[field as keyof this] = obj[field as keyof T] ?? null;
        }
    }
}