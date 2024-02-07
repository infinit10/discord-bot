const { Events, Collection } = require('discord.js');
const config = require('config');

const { timeInSec } = config.get('defaultCooldownTime');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const { cooldowns } = interaction.client;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found`);
            return;
        }

        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamp = cooldowns.get(command.data.name);
        const cooldownTimeInMs = (command.cooldown || timeInSec) * 1000;

        if (timestamp.has(interaction.user.id)) {
            const expireTime = timestamp.get(interaction.user.id) + cooldownTimeInMs;

            if (now < expireTime) {
                const expiredTimestamp = Math.round(expireTime / 1000);
                return interaction.reply({ content: `Please wait, you are on a cooldown. Will be active in <t:${expiredTimestamp}:R>.`, ephemeral: true });
            }
        }

        timestamp.set(interaction.user.id, now);
        setTimeout(() => timestamp.delete(interaction.user.id), cooldownTimeInMs);

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error("Unexpected Error occured", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};