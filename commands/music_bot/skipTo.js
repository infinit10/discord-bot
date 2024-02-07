const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to a certain track number")
        .addNumberOption((opt) => 
            opt.setName("tracknumber")
                .setDescription("track number of the required track")
                .setMinValue(1)
                .setRequired(true),
        ),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);

        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        
        const trackNumber = interaction.options.getNumber('tracknumber');
        if (trackNumber > activeQueue.tracks.length) {
            return interaction.editReply("Invalid Track number")
        }
        activeQueue.skipTo(trackNumber - 1);
        await interaction.editReply(`Skip to track number ${tracknum}`);
    }
}