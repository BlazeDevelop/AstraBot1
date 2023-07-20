const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild) {
            // If guild is not available, return an error message
            return interaction.reply('This command can only be used in a server.');
        }

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(guild.name)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields({ name: 'ID', value: guild.id }, { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true }, { name: 'Region', value: guild.region || 'Unknown', inline: true }, { name: 'Members', value: guild.memberCount.toString(), inline: true }, { name: 'Channels', value: guild.channels.cache.size.toString(), inline: true }, { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true }, { name: 'Created At', value: guild.createdAt.toLocaleString() }, );

        return interaction.reply({ embeds: [embed] });
    },
};