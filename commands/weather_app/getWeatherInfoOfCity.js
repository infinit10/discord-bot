const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('config');
const { getWeatherByCity } = require('../../weather');
const { timeInSec } = config.get('defaultCooldownTime');

function getEmbedObjectForResp(weatherInfo) {
    const { current, location } = weatherInfo;

    const locationVals = [];
    if (location.name) locationVals.push(location.name);
    if (location.region) locationVals.push(location.region);
    if (location.country) locationVals.push(location.country);

    return new EmbedBuilder()
        .setTitle('cityweather')
        .setDescription('Weather Details powered by weatherapi.com')
        .setThumbnail(new URL(`https:${current.condition.icon}`).href)
        .addFields(
            { name: 'Location', value: locationVals.join(", ") },
            { name: 'Temperature', value: String(current.temp_c) },
            { name: 'Feels like', value: String(current.feelslike_c) },
            { name: 'Condition', value: current.condition.text },
            { name: 'Humidity', value: `${current.humidity} %` },
            { name: 'UV Rating', value: String(current.uv) },
        )
        .setTimestamp()
        .setFooter({ text: "All temp in degree celsius" });
}

module.exports = {
    cooldown: timeInSec,
    data: new SlashCommandBuilder()
        .setName("cityweather")
        .setDescription("Lists weather info for your current location (based on IP)")
        .addStringOption((opt) => opt.setName('city')
            .setDescription('City name')
            .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const cityName = interaction.options.getString('city');
            const weatherInfo = await getWeatherByCity({ search: cityName });
            await interaction.reply({ embeds: [getEmbedObjectForResp(weatherInfo)] });
        } catch (error) {
            if (error.message === "Invalid location name provided") {
                await interaction.reply("Invalid location name provided");
            } else {
                await interaction.reply("Unexpected Error Occurred");
            }
        }
    },
};