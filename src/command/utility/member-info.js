const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { getOffence } = require('../../lib/db.js');

module.exports = {
    data: new SlashCommandBuilder().setName('info')
    .setDescription("Fetch info about targetted users")
    .addUserOption(option => 
        option.setName("target")
        .setDescription("Whom to fetch info from")
        .setRequired(true)
    ),

    async execute(interaction) {

        // User
        const member = interaction.options.getMember('target') || interaction.member;
        const user = member.user;

        // Fetch values
        const creation = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
        const offences = getOffence(interaction.guild.id, user.id);

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
                        {name: 'Offences', value: offences},
                    )
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

        await interaction.reply({embeds: [embed]});
    },
};