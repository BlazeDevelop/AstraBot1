const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { Economy } = require('../../models/Economy');
const { Vip } = require('../../models/VIPS');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim your daily reward'),
    async execute(interaction) {
        const user = await Economy.findOne({ userID: interaction.user.id });
        if (!user) {
            return interaction.reply({
                content: "It looks like you don't have an account yet. Use the `create` command to create one.",
                ephemeral: true,
            });
        }
        const oneDay = 24 * 60 * 60 * 1000;
        if (user.lastDaily && Date.now() - user.lastDaily.getTime() < oneDay) {
            return interaction.reply({
                content: 'Stand by! You can only use this command once per day.',
                ephemeral: true,
            });
        }

        let reward = 100 + Math.floor(Math.random() * 900);
        const vipUser = await Vip.findOne({ userId: interaction.user.id });
        if (vipUser) {
            reward *= 100;
        }
        user.balance += reward;
        user.lastDaily = new Date();

        await user.save();
        interaction.reply({
            content: `You received your daily reward of ${reward} coins! Your current balance is ${user.balance}.`,
            ephemeral: true,
        });
    },
};