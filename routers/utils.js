const fs = require('fs');


function addStringToObjectKeys(data, string) {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const modifiedKey = key + string;
            data[modifiedKey] = data[key];
        }
    }
    return data;
}

function getFilesFromDirectory(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        return null; // Directory doesn't exist
    }

    try {
        const files = fs.readdirSync(directoryPath);
        return files;
    } catch (error) {
        console.error('Error reading directory:', error);
        return null;
    }
}

module.exports = {
    addStringToObjectKeys,
    getFilesFromDirectory,
}