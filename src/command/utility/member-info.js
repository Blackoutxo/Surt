const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('info')
    .setDescription("")
    .addSubcommand(subCommand => 
        subCommand
        .setName("member")
        .setDescription("Which member to fetch info from")
    ),

    async execute(interaction) {
        
        try {

        } catch(error) {

        }
    },
};