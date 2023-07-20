const { SlashCommandBuilder } = require('@discordjs/builders');
const { Bank } = require('../../models/Bank');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw money from the bank')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of coins to withdraw').setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (isNaN(amount) || amount <= 0) {
            return interaction.reply('Please provide a valid amount to withdraw');
        }

        const bankAccount = await Bank.findOne({ userId: interaction.user.id });

        if (!bankAccount) {
            return interaction.reply('You do not have a bank account. Please deposit some money first.');
        } else if (bankAccount.balance < amount) {
            return interaction.reply(`You do not have enough funds in your bank account. Your current balance is ${bankAccount.balance} coins.`);
        } else {
            bankAccount.balance -= amount;
            const economyAccount = await Economy.findOne({ userId: interaction.user.id });

            if (!economyAccount) {
                // If user does not have an economy account, create one
                const newEconomyAccount = new Economy({
                    userId: interaction.user.id,
                    balance: amount
                });
                await newEconomyAccount.save();
            } else {
                economyAccount.balance += amount;
                await economyAccount.save();
            }

            await bankAccount.save();
            return interaction.reply(`Successfully withdrew ${amount} coins from your bank account and added it to your economy account!`);
        }
    },
};