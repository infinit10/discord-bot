const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Welcomes the user"),
    async execute(interaction) {
        await interaction.reply(`Welcome ${interaction.user}!`);
    },
};