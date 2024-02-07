const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Current playing song"),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);

        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        const progressBar = await activeQueue.createProgressBar({
            queue: false,
            length: 20,
        });

        const song = activeQueue.current;
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(song.thumbnail)
                    .setDescription(`Currently playing ${song.title} | ${song.url}\n\n` + progressBar),
            ],
        });
    }
}