const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName("song_queue")
            .setDescription("displays the current queue")
            .addNumberOption((opt) => opt
                .setName("page")
                .setDescription("Page Number")
                .setMinValue(1)
            ),
    async execute(interaction) {
        await interaction.deferReply();
        const queue = interaction.client.player.nodes.get(interaction.guildId);

        if (!queue || !queue.isPlaying) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        const noOfPages = Math.ceil(queue.tracks.length / 10) || 1;
        const page = (interaction.options.getNumber("page") || 1);

        if (page > noOfPages) {
            return interaction.editReply(`Invalid page number. Only ${noOfPages} available in total`);
        }
        const queueStr = queue.tracks.data.slice(page * 10, page * 10 +10).map((song, idx) => {
            return `** ${page * 10 + idx + 1}. \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy}`;
        }).join("\n");

        const { currentTrack } = queue;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently playing** \n` + 
                        (currentTrack ? `\`[${currentTrack.duration}]\` ${currentTrack.title} -- <@${currentTrack.requestedBy}` : "Empty") +
                        `\n\n**Queue**\n${queueStr}`
                    )
                    .setFooter({
                        text: `Page ${page} + 1 of ${noOfPages}`
                    })
                    .setThumbnail(currentTrack.thumbnail)
            ]
        })
    }
}