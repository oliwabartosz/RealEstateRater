function addAnsStringToObjectKeys(data) {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const modifiedKey = key + 'Ans';
            data[modifiedKey] = data[key];
        }
    }
    return data;
}

module.exports = {
    addAnsStringToObjectKeys,
}