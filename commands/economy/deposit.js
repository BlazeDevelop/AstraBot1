const { Bank } = require('../../models/Bank');
const { Economy } = require('../../models/Economy');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'deposit',
        description: 'Deposit money into the bank',
        options: [{
            name: 'amount',
            type: 'INTEGER',
            description: 'The amount of coins to deposit',
            required: true,
        }],
    },
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            return interaction.reply({
                content: 'Please provide a valid amount to deposit',
                ephemeral: true,
            });
        }

        const economyAccount = await Economy.findOne({ userID: interaction.user.id });

        if (!economyAccount) {
            return interaction.reply({
                content: 'You don\'t have a profile yet. Send `/create` to create account!',
                ephemeral: true,
            });
        }

        if (economyAccount.balance < amount) {
            return interaction.reply({
                content: `You do not have enough funds in your economy account. Your current balance is ${economyAccount.balance} coins.`,
                ephemeral: true,
            });
        }

        const bankAccount = await Bank.findOne({ userId: interaction.user.id });

        if (!bankAccount) {
            const newBankAccount = new Bank({
                userId: interaction.user.id,
                balance: amount,
            });

            await newBankAccount.save();
        } else {
            bankAccount.balance += amount;
            await bankAccount.save();
        }

        economyAccount.balance -= amount;
        await economyAccount.save();

        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`Deposited ${amount} coins!`)
            .setDescription(`Your new bank account balance is ${bankAccount ? bankAccount.balance + amount : amount}`);

        interaction.reply({ embeds: [embed] });
    },
};