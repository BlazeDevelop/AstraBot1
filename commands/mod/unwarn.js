const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Warn } = require('../../models/Warn');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Unwarn a user')
        .addUserOption(option => option.setName('user').setDescription('The user to unwarn').setRequired(true))
        .addIntegerOption(option => option.setName('index').setDescription('The index of the warn to remove (if not provided, all warns will be removed)')),
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.reply('You do not have sufficient permissions to use this command.');
        }

        const user = interaction.options.getUser('user');

        if (user.id === interaction.user.id) {
            return interaction.reply('You cannot unwarn yourself.');
        }
        if (user.bot) {
            return interaction.reply('You cannot unwarn a bot.');
        }

        Warn.findOne({ userID: user.id }, async(err, warn) => {
            if (err) console.log(err);
            if (!warn || warn.warns.length === 0) {
                return interaction.reply('This user has no warns.');
            }

            const index = interaction.options.getInteger('index');

            if (index === undefined) {
                // Remove all warns
                warn.warns = [];
                await warn.save();
                return interaction.reply(`All warns have been removed from ${user.tag}.`);
            }

            if (index < 1 || index > warn.warns.length) {
                return interaction.reply(`Invalid index. Please provide a number between 1 and ${warn.warns.length}.`);
            }

            const removedWarn = warn.warns.splice(index - 1, 1)[0];
            await warn.save();

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${user.tag}'s warn has been removed`)
                .setDescription(`Reason: ${removedWarn.reason}\nWarner: <@${removedWarn.warner}>`)
                .setFooter(interaction.guild.name, interaction.guild.iconURL());
            return interaction.reply({ embeds: [embed] });
        });
    },
};