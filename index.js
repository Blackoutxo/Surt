require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const surt = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

surt.once('clientReady', () => {
    console.log('Logged in as ${surt.user.tag}!');
});

surt.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content == "!ping") {
        message.reply("pong!");
    }
});

surt.login(process.env.DSC_TOKEN);