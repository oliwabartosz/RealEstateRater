export const FLATS_RECORD_FIELDS = {
    market: 'market',
    offerId: 'offerId',
    offerIdExpected: 'offerIdExpected',
    offerType: 'offerType',
    offerStatus: 'offerStatus',
    dateAdded: 'dateAdded',
    dateUpdated: 'dateUpdated',
    dateEndTransaction: 'dateEndTransaction',
    localization: 'localization',
    street: 'street',
    lawStatus: 'lawStatus',
    price: 'price',
    priceOffer: 'priceOffer',
    rent: 'rent',
    priceM2: 'priceM2',
    livingArea: 'livingArea',
    material: 'material',
    buildingType: 'buildingType',
    yearBuilt: 'yearBuilt',
    floorsNumber: 'floorsNumber',
    buildingQuality: 'buildingQuality',
    flatQuality: 'flatQuality',
    floor: 'floor',
    balcony: 'balcony',
    balconyQuantity: 'balconyQuantity',
    terracesQuantity: 'terracesQuantity',
    loggiasQuantity: 'loggiasQuantity',
    frenchBalconyQuantity: 'frenchBalconyQuantity',
    roomsNumber: 'roomsNumber',
    kitchenType: 'kitchenType',
    basement: 'basement',
    storageRoom: 'storageRoom',
    attic: 'attic',
    parkingPlace: 'parkingPlace',
    priceParkingUnderground: 'priceParkingUnderground',
    priceParkingGround: 'priceParkingGround',
    garden: 'garden',
    elevator: 'elevator',
    security: 'security',
    monitoring: 'monitoring',
    guardedArea: 'guardedArea',
    securityControl: 'securityControl',
    description: 'description',

    balconyDesc: 'balconyDesc',
    frenchBalconyDesc: 'frenchBalconyDesc',
    terraceDesc: 'terraceDesc',
    elevatorDesc: 'elevatorDesc',
    basementDesc: 'basementDesc',
    storageroomDesc: 'storageroomDesc',
    atticDesc: 'atticDesc',
    utilityroomDesc: 'utilityroomDesc',
    parkingSpaceDesc: 'parkingSpaceDesc',
    parkingPlaceDesc: 'parkingPlaceDesc',
    garageDesc: 'garageDesc',
    belongingDesc: 'belongingDesc',
    possibilityDesc: 'possibilityDesc',
    gardenDesc: 'gardenDesc',
    gardenDesc2: 'gardenDesc2',
    gardenDesc3: 'gardenDesc3',
    modernizatedBuildingDesc: 'modernizatedBuildingDesc',
    restoredBuildingDesc: 'restoredBuildingDesc',
    renewedBuildingDesc: 'renewedBuildingDesc',
    insulatedBuildingDesc: 'insulatedBuildingDesc',
    insulatedBuildingDesc2: 'insulatedBuildingDesc2',
    renovationDesc: 'renovationDesc',
    elevationDesc: 'elevationDesc',
    supervisionDesc: 'supervisionDesc',
    supervisionDesc2: 'supervisionDesc2',
    monitoringDesc: 'monitoringDesc',
    monitoringDesc2: 'monitoringDesc2',
    securityDesc: 'securityDesc',
    alarmDesc: 'alarmDesc',
    guardedDesc: 'guardedDesc',
    doorkeeperDesc: 'doorkeeperDesc',
    communityFlatDesc: 'communityFlatDesc',
    cooperativeflatDesc: 'cooperativeflatDesc',
    kitchenDesc: 'kitchenDesc',
    kitchenAnnexDesc: 'kitchenAnnexDesc',
    kitchenBrightDesc: 'kitchenBrightDesc',
    kitchenDarkDesc: 'kitchenDarkDesc',
    kitchenClearanceDesc: 'kitchenClearanceDesc',
    kitchenWindowDesc: 'kitchenWindowDesc',
    kitchenDiningRoomDesc: 'kitchenDiningRoomDesc',
    outbuildingDesc: 'outbuildingDesc',
    outbuildingDesc2: 'outbuildingDesc2',
    outbuildingDesc3: 'outbuildingDesc3',
    feesDesc: 'feesDesc',
    withoutRentDesc: 'withoutRentDesc',
    rentDesc: 'rentDesc',
    levelDesc: 'levelDesc'
};

export const FLATS_RECORD_FIELDS_ANS = {
    technologyAns: 'technologyAns',
    lawStatusAns: 'lawStatusAns',
    balconyAns: 'balconyAns',
    elevatorAns: 'elevatorAns',
    basementAns: 'basementAns',
    garageAns: 'garageAns',
    gardenAns: 'gardenAns',
    modernizationAns: 'modernizationAns',
    alarmAns: 'alarmAns',
    kitchenAns: 'kitchenAns',
    outbuildingAns: 'outbuildingAns',
    qualityAns: 'qualityAns',
    rentAns: 'rentAns',
    commentsAns: 'commentsAns',
    deleteAns: 'deleteAns',
    rateStatus: 'rateStatus',
    user: 'user',
    updateDate: 'updateDate',

};

export const FLATS_RECORD_GPT = {
    id: 'id',
    number: 'number',

    technologyGPT: 'technologyGPT',
    technology_summary: 'technology_summary',

    lawStatusGPT: 'lawStatusGPT',
    law_summary:'law_summary',

    balconyGPT: 'balconyGPT',
    balcony_summary: 'balcony_summary',

    elevatorGPT: 'elevatorGPT',
    elevator_summary: 'elevator_summary',

    basementGPT: 'basementGPT',
    basement_summary: 'basement_summary',

    garageGPT: 'garageGPT',
    garage_summary: 'garage_summary',

    gardenGPT: 'gardenGPT',
    garden_summary: 'garden_summary',

    modernizationGPT: 'modernizationGPT',
    modernization_summary: 'modernization_summary',

    alarmGPT: 'alarmGPT',
    alarm_summary: 'alarm_summary',

    kitchenGPT: 'kitchenGPT',
    kitchen_summary: 'kitchen_summary',

    outbuildingGPT: 'outbuildingGPT',
    outbuilding_summary: 'outbuilding_summary',

    qualityGPT: 'qualityGPT',

    rentGPT: 'rentGPT',
    rent_summary: 'rent_summary',

    commentsGPT: 'commentsGPT',
    status: 'status'
};
// @TODO: Add args to type, change lists argsAns, argsPartialAns and argsGPT from list to object in SQL Queries.
type Args = {
    argsAns: string[],
    argsPartialAns: string[],
    argsGPT: string[],
}
export const args: Args = {
    argsAns: [
        "flatId", "technologyAns", "lawStatusAns", "balconyAns", "elevatorAns", "basementAns", "garageAns",
        "gardenAns", "modernizationAns", "alarmAns", "kitchenAns", "outbuildingAns",
        "qualityAns", 'rentAns', 'commentsAns', 'deleteAns', 'rateStatus', 'user',
    ],
    argsPartialAns: [
        "flatId", "technologyAns", "elevatorAns", "basementAns", "garageAns", "gardenAns",
        "modernizationAns", "alarmAns", "kitchenAns", "outbuildingAns", "qualityAns",
        "commentsAns",
    ],
    argsGPT: [
    "flatId", "technologyGPT", "technology_summary", "lawStatusGPT", "law_summary",  "balconyGPT", "balcony_summary",
    "elevatorGPT", "elevator_summary", "basementGPT", "basement_summary", "garageGPT", "garage_summary", "gardenGPT",
    "garden_summary", "modernizationGPT", "modernization_summary", "alarmGPT", "alarm_summary", "kitchenGPT",
    "kitchen_summary", "outbuildingGPT", "qualityGPT", "rentGPT", "rent_summary", "commentsGPT", 'status'
]
}

export const argsAns: string[] = [
    "flatId", "technologyAns", "lawStatusAns", "balconyAns", "elevatorAns", "basementAns", "garageAns",
    "gardenAns", "modernizationAns", "alarmAns", "kitchenAns", "outbuildingAns",
    "qualityAns", 'rentAns', 'commentsAns', 'deleteAns', 'rateStatus', 'user',
    ];

export const argsPartialAns: string[] = [
    "flatId", "technologyAns", "elevatorAns", "basementAns", "garageAns", "gardenAns",
    "modernizationAns", "alarmAns", "kitchenAns", "outbuildingAns", "qualityAns",
    "commentsAns",
];

export const argsGPT: string[] = [
    "flatId", "technologyGPT", "technology_summary", "lawStatusGPT", "law_summary",  "balconyGPT", "balcony_summary",
    "elevatorGPT", "elevator_summary", "basementGPT", "basement_summary", "garageGPT", "garage_summary", "gardenGPT",
    "garden_summary", "modernizationGPT", "modernization_summary", "alarmGPT", "alarm_summary", "kitchenGPT",
    "kitchen_summary", "outbuildingGPT", "qualityGPT", "rentGPT", "rent_summary", "commentsGPT", 'status'
];

