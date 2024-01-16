const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user_detail')
        .setDescription('Gets user information'),
    async execute(interaction) {
        console.log("🚀 ~ execute ~ interaction:", interaction)
        await interaction.reply(`This command was triggered by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}`);
    },
};