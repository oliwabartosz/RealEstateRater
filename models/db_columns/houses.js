function housesRecords(record) {
    return {
        id: record.id,
        number: record.number,
        market: record.market,
        offerId: record.offerId,
        offerIdExpected: record.offerIdExpected,
        offerType: record.offerType,
        offerStatus: record.offerStatus,
        dateAdded: record.dateAdded,
        dateChanged: record.dateChanged,
        dateUpdated: record.dateUpdated,
        dateEndTransaction: record.dateEndTransaction,
        localization: record.localization,
        street: record.street,
        lawStatus: record.lawStatus,
        price: record.price,
        livingArea: record.livingArea,
        houseArea: record.houseArea,
        plotArea: record.plotArea,
        houseQuality: record.houseQuality,
        priceM2: record.priceM2,
        houseType: record.houseType,
        buildingQuality: record.buildingQuality,
        material: record.material,
        yearBuilt: record.yearBuilt,
        parkingPlace: record.parkingPlace,
        floorsNumber: record.floorsNumber,
        garagesNumber: record.garagesNumber,
        roomsNumber: record.roomsNumber,
        kitchenType: record.kitchenType,
        bathsNumber: record.bathsNumber,
        basement: record.basement,
        lotShape: record.lotShape,
        garden: record.garden,
        fence: record.fence,
        monitoring: record.monitoring,
        security: record.security,
        guardedArea: record.guardedArea,
        guardedEstate: record.guardedEstate,
        securityControl: record.securityControl,
        description: record.description

    }
}

module.exports = {
    housesRecords,
}
