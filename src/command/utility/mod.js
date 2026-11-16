const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
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
        if (!interaction.inGuild()) {
            return interaction.reply({
                content: "Only in server!",
                flags: MessageFlags.Ephemeral,
            });
        }

        // Values
        const member = interaction.options.getMember("target", true);
        const action = interaction.options.getString("action", true);
        const reason = interaction.options.getString("reason") || "No reason provided.";

        // Several permission, self sabotage, hierarchy checks
        if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({
                content: "Only a moderator can use this command.",
            });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({
                content: "You cannot self moderate!",
                flags: MessageFlags.Ephemeral
            });
        }

        if (member) {
            const isGuildOwner = interaction.user.id === interaction.guild.ownerId;
            const isHigher = isGuildOwner || interaction.member.roles.highest.comparePositionTo(member.roles.highest) > 0;

            // Hierarchy check
            if (!isHigher) {
                return interaction.reply({
                    content: "You cannot moderate someone who has higher role than you!",
                    flags: MessageFlags.Ephemeral,
                });
            }

            // Action
            switch (action) {
                case "warn": {
                    return interaction.reply({
                        content: `${member.user.tag} has been warned by ${interaction.user.tag} for ${reason}`,
                    });
                }
                case "timeout": {                    
                    await member.timeout(5 * 60 * 1000, reason);
                    return interaction.reply({
                        content: `${member.user.tag} has been timed out by ${interaction.user.tag} for ${reason}`
                    });
                }
                case "kick": {
                    await interaction.guild.members.kick(member.id, { reason });
                    return interaction.reply({
                        content: `${member.user.tag} has been kicked out by ${interaction.user.tag} for ${reason}`
                    });
                }
                case "ban": {
                    await interaction.guild.members.ban(member.id, { reason });
                    return interaction.reply({
                        content: `${member.user.tag} has been banned by ${interaction.user.tag} for ${reason}`
                    });
                }
            }

            // Add offence in database
            addOffence(interaction.guild.id, member.id, interaction.user.id, action, reason);

            return interaction.reply({
                content: `Logged in user's offence`,
                Ephemeral: true
            });

        } else {
            return interaction.reply({
                content: `user is not in the server!`,
                Ephemeral: true
            });
        }
    }
};