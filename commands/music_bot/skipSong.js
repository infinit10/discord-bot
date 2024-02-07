const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips to the next song in the queue"),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);

        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        const currentSong = queue.current;
        queue.skip();
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`{currentSong.title} has been skipped`)
                    .setThumbnail(currentSong.thumbnail),
            ],
        });
    }
}