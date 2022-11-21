import mysql from 'mysql2';
import * as dotenv from 'dotenv';
dotenv.config();

export const dbConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
});