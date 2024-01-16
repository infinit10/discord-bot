const axios = require('axios');
const appConfig = require('./config.json');

async function getWeatherByCity(params = {}) {
    const { aqi = "no" } = params;
    try {
        const url = new URL('/v1/current.json', 'http://api.weatherapi.com');
        url.searchParams.append('key', appConfig.weather.apiKey);
        url.searchParams.append('q', "auto:ip");
        url.searchParams.append('aqi', aqi);

        const response = await axios({
            method: "get",
            url: url.href,
        });
        return response.data;
    } catch (error) {
        if (error.response.data.code === 1006) {
            throw new Error("Invalid location name provided");
        }
    }
}

module.exports = {
    getWeatherByCity,
};
