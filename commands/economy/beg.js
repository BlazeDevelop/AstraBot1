const { SlashCommandBuilder } = require('@discordjs/builders');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Ask for some coins!'),
    async execute(interaction) {
        const user = interaction.user;
        const economy = await Economy.findOne({ userID: user.id });
        if (!economy) {
            return interaction.reply('You do not have an account yet. Use `/start` to create one.');
        }
        const currentTime = new Date();
        const timeDiff = currentTime - economy.lastBeg;
        const cooldown = 7200000; // 2 hours in milliseconds
        if (timeDiff < cooldown && economy.lastBeg) {
            const remainingTime = cooldown - timeDiff;
            const hours = Math.floor(remainingTime / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return interaction.reply(`You have already begged recently. Please wait ${hours}h ${minutes}m ${seconds}s before begging again.`);
        }
        const minCoins = 50;
        const maxCoins = 250;
        const coins = Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
        economy.balance += coins;
        economy.lastBeg = currentTime;
        await economy.save();
        return interaction.reply(`You begged and received ${coins} coins.`);
    },
};