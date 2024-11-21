const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();

app.use(express.json());

const USER_AGENT = process.env.USER_AGENT;

async function getLonLat(location){
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.MAPS_API_KEY}`)

    if (!response.ok) {
        throw new Error(`Error fetching geocode: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results[0].geometry.location;
}

async function getWeatherForecast(latitude, longitude) {
    try {
        const pointResponse = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, {
            headers: { 'User-Agent': USER_AGENT }
        });

        if (!pointResponse.ok) {
            throw new Error(`Error fetching point data: ${pointResponse.statusText}`);
        }

        const pointData = await pointResponse.json();
        const forecastUrl = pointData.properties.forecast;

        const forecastResponse = await fetch(forecastUrl, {
            headers: { 'User-Agent': USER_AGENT }
        });

        if (!forecastResponse.ok) {
            throw new Error(`Error fetching forecast data: ${forecastResponse.statusText}`);
        }

        const forecastData = await forecastResponse.json();
        return forecastData;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY
});

app.get("/clothing/:location", async (rec, res) => {
    try {

        location = await getLonLat(rec.params.location);

        latitude = location.lat;
        longitude = location.lng;

        weather = await getWeatherForecast(latitude, longitude);
        weather = weather.properties.periods[0];

        const prompt = `Based on this data, make clothing recomendations:
        temperature: ${weather.temperature} ${weather.temperatureUnit}
        wind speed: ${weather.windSpeed}
        % change of precipitation: ${weather.probabilityOfPrecipitation.value}
        is day time?: ${weather.isDaytime}
        
        respond with a short list of clothing items`

        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 64
        });        

        console.log(response);

        return res.status(200).json({
            success: true,
            data: response.choices[0].message.content
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
