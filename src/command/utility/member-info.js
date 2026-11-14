const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Colors, MessageFlags} = require('discord.js');
const { getOffences } = require('../../lib/db.js');

module.exports = {
    data: new SlashCommandBuilder().setName('info')
    .setDescription("Fetch info about targetted users")
    .addUserOption(option => 
        option.setName("target")
        .setDescription("Whom to fetch info from")
        .setRequired(true)
    ),

    async execute(interaction) {
        const isAdmin = interaction.memberPermissions.has(PermissionFlagsBits.Administrator);

        // Check if interacting user is admin
        if (!isAdmin) {
            return interaction.reply({ 
                content: "You do not have admin permissions to use this.",
                flags: MessageFlags.Ephemeral,
            });
        }

        // User
        const member = interaction.options.getMember('target') || interaction.member;
        const user = member.user;

        // Fetch values
        const creation = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
        const offences = getOffences(interaction.guild.id, user.id);

        const offenceSummary = offences.length === 0 
              ? 'None in record'
              : offences
                .map(o => `${o.action} (<t:${Math.floor(o.createdAt / 1000)}:r) - ${o.reason || 'No reason'}`)
                .join('\n');

        // Embed
        const embed = new EmbedBuilder()
                    .setColor(Colors.Aqua)
                    .setTitle(`Info aboout ${user.tag}`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        {name: 'Account Created', value: creation},
                        {name: 'Offences', value: offenceSummary},
                    )
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

        await interaction.reply({embeds: [embed]});
    },
};