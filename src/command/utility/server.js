const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('server').setDescription('Provides information about the server.'),
	async execute(interaction) {

		if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({
				content: "Only an admin can access this command",
				flags: MessageFlags.Ephemeral
			});
		}

		await interaction.reply({
			content: `This server has ${interaction.guild.memberCount} members.`,
            flags: MessageFlags.Ephemeral,
		});
	},
};