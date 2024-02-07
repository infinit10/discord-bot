const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes paused song"),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);

        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        activeQueue.setPaused(false);
        await interaction.editReply("Track resumed. Use /pause to pause again");
    }
}