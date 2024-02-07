const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stops the bot and clears the queue"),
    async execute(interaction) {
        const activeQueue = interaction.client.player.nodes.get(interaction.guildId);

        if (!activeQueue) {
            return interaction.editReply('No songs in the queue');
        }
        await interaction.deferReply();
        activeQueue.destroy();
        await interaction.editReply("Byee! See you soon");
    }
}