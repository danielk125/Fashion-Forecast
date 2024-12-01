require("dotenv").config();

async function getLonLat(location){
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.MAPS_API_KEY}`)

    if (!response.ok) {
        throw new Error(`Error fetching geocode: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results[0].geometry.location;
}

module.exports = getLonLat