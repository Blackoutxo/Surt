const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { addOffence } = require('../../lib/db.js');

module.exports = {
    data: new SlashCommandBuilder().setName("mod")
          .setDescription("Used to moderate users")
          .addUserOption(option => 
            option.setName("target")
            .setDescription("Whom to moderate")
            .setRequired(true)
          )
          .addStringOption(option => 
            option.setName("action")
            .setDescription("How to moderate the user")
            .setRequired(true)
            .addChoices(
                {name: "warn", value: "warn"},
                {name: "Timeout (5m)", value: "timeout"},
                {name: "Kick", value: "kick"},
                {name: "Ban", value: "ban"}
            )
          )
          .addStringOption(option => 
            option.setName("reason")
            .setDescription("For what reason the user has been punished")
          ),

    async execute(interaction) {

        // Values
        const targetUser = interaction.options.getUser("target", true);
        const memId = interaction.guild.member.fetch(targetUser.id).catch();
        const action = interaction.options.getString("action", true);
        const reason = interaction.options.getString("reason") || "No reason provided.";

        // Self & Moderatable user check
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: "You cannot self moderate!",
                flags: MessageFlags.Ephemeral
            });
        }
    }
};