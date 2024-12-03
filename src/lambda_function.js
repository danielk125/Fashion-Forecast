const getLonLat = require('./getLonLat');
const getWeatherForecast = require('./getWeatherForecast');
const manageData = require('./manageData');

exports.handler = async (event) => {
    try {
        const locationName = event.pathParameters.location;

        const location = await getLonLat(locationName);
        const latitude = location.lat;
        const longitude = location.lng;

        let weather = await getWeatherForecast(latitude, longitude);

        if (weather == undefined) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    success: false,
                    data: "Invalid location"
                }),
            };
        }

        weather = weather.properties.periods[0];
        weather = {
            temperature: weather.temperature,
            temperatureUnit: weather.temperatureUnit,
            windSpeed: weather.windSpeed,
            probabilityOfPrecipitation: weather.probabilityOfPrecipitation.value ?? 0.0,
            isDaytime: weather.isDaytime
        };

        const data = await manageData(weather);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                data: data
            }),
        };
    } catch (err) {
        console.error(err);

        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: false,
                error: err.message || err,
            }),
        };
    }
};
