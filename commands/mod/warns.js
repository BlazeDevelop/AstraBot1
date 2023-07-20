const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Warn } = require('../../models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('List all warns for a user')
        .addUserOption(option => option.setName('user').setDescription('The user to show warns for').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply('You do not have sufficient permissions to use this command.');
        }
        const user = interaction.options.getUser('user');

        Warn.findOne({ userID: user.id }, async(err, warn) => {
            if (err) console.log(err);
            if (!warn) {
                return interaction.reply('This user has no warns.');
            }

            const embed = new MessageEmbed()
                .setColor('ORANGE')
                .setTitle(`Warns for ${user.tag}`)
                .setDescription(warn.warns.map((w, i) => `**#${i + 1}:**\nReason: ${w.reason}\nWarner: <@${w.warner}>\nDate: ${w.date}`).join('\n\n'))
                .setFooter(interaction.guild.name, interaction.guild.iconURL());
            return interaction.reply({ embeds: [embed] });
        });
    },
};