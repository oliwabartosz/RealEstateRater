import mysql, {Pool} from "mysql2/promise";
import {v4 as uuid} from "uuid";


export const pool: Pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    namedPlaceholders: true, // for prepared statements
    bigNumberStrings: false,
    decimalNumbers: true,
});
