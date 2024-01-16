const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("Gets server info"),
    async execute(interaction) {
        await interaction.reply(`Server is ${interaction.guild.name} and has ${interaction.guild.memberCount} people`);
    },
};