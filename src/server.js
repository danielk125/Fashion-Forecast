const express = require("express");
const cors = require("cors");
require("dotenv").config();
const getLonLat = require('./getLonLat')
const getWeatherForecast = require('./getWeatherForecast')
const manageData = require('./manageData')

const app = express();

app.use(express.json());

app.get("/clothing/:location", async (rec, res) => {
    try {

        location = await getLonLat(rec.params.location);

        latitude = location.lat;
        longitude = location.lng;

        weather = await getWeatherForecast(latitude, longitude);
        weather = weather.properties.periods[0];
        weather = {
            temperature: weather.temperature,
            temperatureUnit: weather.temperatureUnit,
            windSpeed: weather.windSpeed,
            probabilityOfPrecipitation: weather.probabilityOfPrecipitation.value ?? 0.0,
            isDaytime: weather.isDaytime
        }

        console.log(weather);

        data = await manageData(weather);

        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            error: err
        })
    }
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
