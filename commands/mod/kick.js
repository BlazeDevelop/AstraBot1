const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick')),

    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Check if the author can kick the mentioned member
        if (!member.kickable) {
            return interaction.reply({
                content: 'You do not have sufficient permissions to kick this member.',
                ephemeral: true
            });
        }

        // Kick the member and send the kick embed
        await member.kick(reason)
            .then(() => {
                const kickEmbed = new MessageEmbed()
                    .setTitle('Member Kicked')
                    .setColor('#ff0000')
                    .addField('Kicked Member', `${member.user.tag}`)
                    .addField('Kicked By', `${interaction.user.tag}`)
                    .addField('Reason', reason);
                return interaction.reply({
                    embeds: [kickEmbed],
                    ephemeral: false
                });
            })
            .catch(err => {
                console.error(err);
                return interaction.reply({
                    content: 'There was an error while trying to kick the member.',
                    ephemeral: true
                });
            });
    }
};