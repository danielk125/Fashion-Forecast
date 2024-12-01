require("dotenv").config();
const db = require('./dbConn');
const promptGPT = require('./promptGPT')
const mysql = require("mysql");
const util = require('util');
db.query = util.promisify(db.query);

async function manageData(weather) {
    try {
        sql = `SELECT *
            FROM Weather_Conditions
            WHERE 
                temperature = ${mysql.escape(weather.temperature)} AND
                wind_speed = ${mysql.escape(weather.windSpeed)} AND
                precipitation_chance = ${mysql.escape(weather.probabilityOfPrecipitation)} AND
                time_of_day = ${mysql.escape(weather.isDaytime)}
            ;
        `;

        result = await db.query(sql);

        console.log("WOW")

        if (result.length > 0){
            sql = `SELECT *
                FROM Clothing
                WHERE weather_id = ${mysql.escape(result[0].weather_id)}
                ;
            `;

            clothes = await db.query(sql)

            return clothes[0]
        } else {
            data = await promptGPT(weather);
            console.log(data);

            sql = `
                INSERT INTO Weather_Conditions (temperature, wind_speed, precipitation_chance, time_of_day)
                VALUES (${mysql.escape(weather.temperature)}, ${mysql.escape(weather.windSpeed)}, ${mysql.escape(weather.probabilityOfPrecipitation)}, ${mysql.escape(weather.isDaytime)});
            `

            weatherInsert = await db.query(sql)
            weather_id = weatherInsert.insertId

            sql = `
                INSERT INTO Clothing (weather_id, clothing_1, clothing_2, clothing_3, clothing_4)
                VALUES (${mysql.escape(weather_id)}, ${mysql.escape(data.clothing_1)}, ${mysql.escape(data.clothing_2)}, ${mysql.escape(data.clothing_3)}, ${mysql.escape(data.clothing_4)});
            `;

            await db.query(sql); // THIS LINE

            console.log("Clothing added")

            return data
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = manageData