const fs = require('fs');
const path = require('path');

const discordClient = require('discord.js');
const appConfig = require('./config.json');

const client = new discordClient.Client({ intents: [discordClient.GatewayIntentBits.Guilds] });
client.commands = new discordClient.Collection();

client.cooldowns = new discordClient.Collection();

const commandFolderPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandFolderPath);

commandFolders.forEach((folder) => {
    const commandPath = path.join(commandFolderPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter((file) => file.slice(-3) === '.js');

    commandFiles.forEach((file) => {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if (!(command.data && command.execute)) console.warn(`Command at ${filePath} is missing either data or execute or both`);
        client.commands.set(command.data.name, command);
    });
});

const eventsFolderPath = path.join(__dirname, 'events');
const events = fs.readdirSync(eventsFolderPath).filter((file) => file.slice(-3) === '.js');
events.forEach((eventFile) => {
    const filePath = path.join(eventsFolderPath, eventFile);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
});

client.login(appConfig.token);
