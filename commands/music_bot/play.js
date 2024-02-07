const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a song fom YouTube")
        .addSubcommand((subcmd) => subcmd
            .setName("song_name")
            .setDescription("loads a given song")
            .addStringOption((opt) => opt
                .setName("song")
                .setDescription("The song's url")
                .setRequired(true)
            )
        )
        .addSubcommand((subcmd) => subcmd
            .setName('playlist')
            .setDescription("loads the given playlist")
            .addStringOption((opt) => opt
                .setName("playlist_url")
                .setDescription("URL of the playlist")
                .setRequired(true)
            )
        )
        .addSubcommand((subcmd) => subcmd
            .setName('search')
            .setDescription("search song based on keyword")
            .addStringOption((opt) => opt
                .setName("search_parameters")
                .setDescription("Search keywords")
                .setRequired(true)
            )
        ),
    execute: async (interaction) => {
        if (!interaction.member.voice.channel) {
            return interaction.reply("You need to be in a voice channel to play songs");
        }
        await interaction.deferReply();
        const { client } = interaction;
        const { player } = client;
        await player.extractors.loadDefault();

        const queue = await player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user,
            },
            selfDeaf: true,
            volume: 80,
            leaveOnEmpty: false,
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000,
          },
        );

        if (!queue.connection) {
            // if bot is not in voice channel, we connect it to the current channel
            await queue.connect(interaction.member.voice.channel);
        }
        console.log("HERE")
        let embed = new EmbedBuilder();
        console.log("🚀 ~ execute: ~ interaction.options.getSubcommand():", interaction.options.getSubcommand())

        if (interaction.options.getSubcommand() === 'song_name') {
            let url = interaction.options.getString("song");
            console.log("🚀 ~ execute: ~ url:", url)
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            })

            if (!result.tracks.length) return interaction.reply("Song not found");

            const song = result.tracks[0];
            console.log("🚀 ~ execute: ~ song:", song)
            await queue.addTrack(song);
            console.log("===> ", `** [${song.title}] | ${song.url} ** has been added`)
            console.log("===> ", `Track Length: ${song.duration}`);
            embed
                .setDescription(`** [${song.title}] | ${song.url} ** has been added`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Track Length: ${song.duration}`});
        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString("playlist_url");
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            })

            if (!result.tracks.length) return interaction.reply("Playlist not found");

            const { playlist } = result;
            await queue.addTrack(result.tracks);

            embed
                .setDescription(`** ${result.tracks.length} songs from [${playlist.title}] | ${playlist.url} ** has been added`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Track Length: ${song.duration}`});
        }
        else if (interaction.options.getSubcommand() === 'search') {
            let url = interaction.options.getString("search_parameters");
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE,
            })

            if (!result.tracks.length) return interaction.reply("Not found");

            const song = result.tracks[0];
            await queue.addTrack(song);

            embed
                .setDescription(`** [${song.title}] | ${song.url} ** has been added`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Track Length: ${song.duration}`});
        }

        if (!queue.node.playing) await queue.node.play();
        
        await interaction.editReply({
            embeds: [embed],
        });
    }
}