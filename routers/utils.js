function addStringToObjectKeys(data, string) {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const modifiedKey = key + string;
            data[modifiedKey] = data[key];
        }
    }
    return data;
}

module.exports = {
    addStringToObjectKeys,
}