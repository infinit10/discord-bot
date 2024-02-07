const discordClient = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('config');

const { token, appID, serverID } = config.get('discord');

const commandFolderPath = path.join(__dirname, "commands");
console.log(commandFolderPath);
const commandFolders = fs.readdirSync(commandFolderPath);

const commands = [];
commandFolders.forEach((folder) => {
    const commandPath = path.join(commandFolderPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter((file) => file.slice(-3) === '.js');

    commandFiles.forEach((file) => {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);
        if (!(command.data && command.execute)) console.warn(`Command at ${filePath} is missing either data or execute or both`);
        commands.push(command.data.toJSON());
    });
});

const rest = new discordClient.REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} app (/) commands`);

        const data = await rest.put(
            discordClient.Routes.applicationGuildCommands(appID, serverID),
            { body: commands },
        );

        console.log(`Successfully loaded ${data.length} app (/) commands`);
    } catch (error) {
        console.error(error);
    }
})();