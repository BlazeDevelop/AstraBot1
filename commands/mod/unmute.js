const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Removes the Muted role from a specified user.')
        .addUserOption(option => option.setName('user').setDescription('The user to unmute').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the unmute')),

    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return await interaction.reply('You do not have permission to use this command.');
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            return await interaction.reply('There is no Muted role in this server.');
        }

        const unmuteEmbed = new MessageEmbed()
            .setColor('#00ff00')
            .setTitle(`Unmuted User: ${user.username}`)
            .addFields({ name: 'Unmuted By:', value: interaction.user.username }, { name: 'Reason:', value: reason })
            .setTimestamp()
            .setFooter(`ID: ${user.id}`);
        await interaction.reply({ embeds: [unmuteEmbed] });

        interaction.guild.members.cache.get(user.id).roles.remove(muteRole);
    },
};
