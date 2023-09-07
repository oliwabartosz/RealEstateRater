import fs from "fs";

export function addStringToObjectKeys(data: Record<string, any>, stringToAdd: string): Record<string, any> {
    const modifiedData: Record<string, any> = {};

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const modifiedKey = key + stringToAdd;
            modifiedData[modifiedKey] = data[key];
        }
    }

    return modifiedData;
}

function getFilesFromDirectory(directoryPath: string): string[] | null {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
        return null; // Directory doesn't exist
    }

    try {
        // Read the contents of the directory (list of files)
        return fs.readdirSync(directoryPath);
    } catch (error) {
        // Handle any errors that occur during directory reading
        console.error('Error reading directory:', error);
        return null;
    }
}
