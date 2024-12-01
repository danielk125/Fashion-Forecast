const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.RDS_ENDPOINT,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_NAME,
    connectionLimit: 10 
});

module.exports = db;