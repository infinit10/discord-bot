const axios = require('axios');
const config = require('config');
const { apiKey } = config.get("weather");

async function getWeatherByCity(params = {}) {
    const { aqi = "no", search = "auto:ip" } = params;
    try {
        const url = new URL('/v1/current.json', 'http://api.weatherapi.com');
        url.searchParams.append('key', apiKey);
        url.searchParams.append('q', search);
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
