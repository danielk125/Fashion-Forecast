require("dotenv").config();
const USER_AGENT = process.env.USER_AGENT;

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

module.exports = getWeatherForecast;