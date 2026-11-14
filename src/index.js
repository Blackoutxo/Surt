require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, MessageFlags, Collection } = require('discord.js');
const { log } = require('./lib/log.js');

const surt = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const foldersPath = path.join(__dirname, 'command');
const commandFolders = fs.readdirSync(foldersPath);

// Info login message
surt.once('clientReady', (a) => {
    log.info(`Logged in as ${a.user.tag}`);
});

// Commands collection
surt.commands = new Collection();

// Commands folder accessor
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			surt.commands.set(command.data.name, command);
		} else {
			log.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Interactions
surt.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		log.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		log.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// Login
surt.login(process.env.TOKEN);