const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getWeatherByCity } = require('../../weather');

function getEmbedObjectForResp(weatherInfo) {
    const { current, location } = weatherInfo;

    const locationVals = [];
    if (location.name) locationVals.push(location.name);
    if (location.region) locationVals.push(location.region);
    if (location.country) locationVals.push(location.country);

    return new EmbedBuilder()
        .setTitle('Weather')
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
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Lists weather info for the given city"),
    async execute(interaction) {
        try {
            const weatherInfo = await getWeatherByCity();
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