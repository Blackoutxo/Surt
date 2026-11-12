const { REST, Routes } = require('discord.js');
require('dotenv').config();
const { log } = require('./lib/log.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const foldersPath = path.join(__dirname, 'command');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			log.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		log.info(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(Routes.applicationCommand(clientId), { body: commands });

		log.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();