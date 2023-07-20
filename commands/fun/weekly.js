const Discord = require('discord.js');
const mongoose = require('mongoose');
const { Economy } = require('../../models/Economy');
const { Vip } = require('../../models/VIPS');

module.exports = {
    data: {
        name: 'weekly',
        description: 'Claim your weekly reward',
    },
    async execute(interaction) {
        const user = await Economy.findOne({ userID: interaction.user.id });
        if (!user) return interaction.reply("It looks like you don't have an account yet. Use the `create` command to create one.");
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        if (user.lastWeekly && (Date.now() - user.lastWeekly.getTime() < oneWeek)) {
            return interaction.reply("Stand by! You can only use this command once per week.");
        }
        const vipUser = await Vip.findOne({ userId: interaction.user.id });
        let reward = 500 + Math.floor(Math.random() * 2000);
        if (vipUser) {
            reward *= 100; // Увеличиваем заработную плату в 100 раз для VIP-аккаунтов
        }
        user.balance += reward;
        user.lastWeekly = new Date();

        await user.save();
        interaction.reply(`You received your weekly reward of ${reward} coins! Your current balance is ${user.balance}.`);
    }
};