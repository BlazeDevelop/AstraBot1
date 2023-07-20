const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { Warn } = require('../../models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warn').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply('You do not have sufficient permissions to use this command.');
        }
        const user = interaction.options.getUser('user');
        if (user.id === interaction.user.id) {
            return interaction.reply('You cannot warn yourself.');
        }
        if (user.bot) {
            return interaction.reply('You cannot warn a bot.');
        }
        const reason = interaction.options.getString('reason');

        Warn.findOne({ userID: user.id }, async(err, warn) => {
            if (err) console.log(err);
            if (!warn) {
                const newWarn = new Warn({
                    userID: user.id,
                    warns: [{
                        reason,
                        date: new Date(),
                        warner: interaction.user.id // сохраняем ID пользователя, выдавшего предупреждение
                    }]
                });
                newWarn.save().catch(err => console.log(err));
                const embed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle(`${user.tag} has been warned`)
                    .setDescription(`Reason: ${reason}\nWarner: <@${interaction.user.id}>`) // добавляем информацию о пользователе, выдавшем предупреждение
                    .setFooter(interaction.guild.name, interaction.guild.iconURL());
                interaction.reply({ embeds: [embed] });
            } else {
                warn.warns.push({
                    reason,
                    date: new Date(),
                    warner: interaction.user.id // сохраняем ID пользователя, выдавшего предупреждение
                });
                warn.save().catch(err => console.log(err));
                const embed = new MessageEmbed()
                    .setColor('ORANGE')
                    .setTitle(`${user.tag} has been warned`)
                    .setDescription(`Reason: ${reason}\nWarner: <@${interaction.user.id}>`) // добавляем информацию о пользователе, выдавшем предупреждение
                    .setFooter(interaction.guild.name, interaction.guild.iconURL());
                interaction.reply({ embeds: [embed] });
            }
        });
    },
};