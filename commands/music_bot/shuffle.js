const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue"),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);

        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        activeQueue.shuffle();
        await interaction.editReply(`${queue.tracks.length} tracks in the queue are shuffled`);
    }
}