const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause currently playing song"),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);
        console.log("🚀 ~ execute ~ activeQueue:", activeQueue)
        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        activeQueue.pause();
        await interaction.editReply("Track paused. Use /resume to start playing again");
    }
}