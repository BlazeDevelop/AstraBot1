const { SlashCommandBuilder } = require('@discordjs/builders');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay coins to another user.')
        .addUserOption(option => option.setName('user').setDescription('The user you want to pay.').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of coins to pay.').setRequired(true)),
    async execute(interaction) {
        const recipient = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (!recipient) {
            return interaction.reply('You must mention a user to pay.');
        }

        if (isNaN(amount) || amount <= 0) {
            return interaction.reply('You must specify a positive integer amount of coins to pay.');
        }

        const senderEconomy = await Economy.findOne({ userID: interaction.user.id });
        if (!senderEconomy || senderEconomy.balance < amount) {
            return interaction.reply('You do not have enough coins to make this payment.');
        }

        const recipientEconomy = await Economy.findOne({ userID: recipient.id });
        if (!recipientEconomy) {
            return interaction.reply('The recipient does not have an economy account.');
        }

        senderEconomy.balance -= amount;
        recipientEconomy.balance += amount;

        try {
            await senderEconomy.save();
            await recipientEconomy.save();
            return interaction.reply(`Successfully paid ${amount} coins to ${recipient.username}.`);
        } catch (err) {
            console.error(err);
            return interaction.reply('An error occurred while processing your payment.');
        }
    },
};