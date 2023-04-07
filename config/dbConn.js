const mysql = require('mysql2/promise');
const {v4: uuid} = require('uuid');

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    namedPlaceholders: true, // for prepared statements
    bigNumberStrings: false,
    decimalNumbers: true,
});

module.exports = {
    pool,
}