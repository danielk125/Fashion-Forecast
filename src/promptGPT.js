const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.GPT_API_KEY
});

async function promptGPT(weather) {
    try {
        const prompt = `Based on this data, make clothing recomendations:
        temperature: ${weather.temperature} ${weather.temperatureUnit}
        wind speed: ${weather.windSpeed}
        % chance of precipitation: ${weather.probabilityOfPrecipitation}
        is day time?: ${weather.isDaytime}
        
        respond ONLY with a list of 4 clothing items delineated by COMMAS and nothing else`

        const response = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 128
        });        

        data = response.choices[0].message.content;

        data = data.split(", ")

        data = {
            clothing_1: data[0],
            clothing_2: data[1],
            clothing_3: data[2],
            clothing_4: data[3]
        }

        return data;
    } catch (error){
        console.log(error.message);
    }
    
}

module.exports = promptGPT