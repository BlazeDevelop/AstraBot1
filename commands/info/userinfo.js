const { MessageEmbed } = require('discord.js');
const { Economy } = require('../../models/Economy')
const { Bank } = require('../../models/Bank')
const { Warn } = require('../../models/Warn')
const { Vip } = require('../../models/VIPS')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays user information')
        .addUserOption(option => option.setName('user').setDescription('The user to get information on')),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;

        const economyResult = await Economy.findOne({ userID: targetUser.id });
        const bankResult = await Bank.findOne({ userId: targetUser.id });
        const vipResult = await Vip.findOne({ userId: targetUser.id });
        const warnResult = await Warn.findOne({ userID: targetUser.id });

        const embed = new MessageEmbed()
            .setTitle(`${targetUser.tag}'s Information`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addField('Bank Balance', `${bankResult ? bankResult.balance : 0}`, true)
            .addField('Wallet Balance', `${economyResult ? economyResult.balance : 0}`, true)
            .addField('VIP', `${vipResult && vipResult.isVip ? 'Yes' : 'No'}`, true)
            .addField('Warns', `${warnResult ? warnResult.warns.length : 0}`, true)

        await interaction.reply({ embeds: [embed] });
    },
};