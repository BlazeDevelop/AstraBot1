const { MessageEmbed } = require('discord.js');
const { Economy } = require('../../models/Economy');
const { Bank } = require('../../models/Bank');

module.exports = {
    data: {
        name: 'balance',
        description: 'Displays the user\'s current balance',
        options: [{
            name: 'user',
            description: 'The user whose balance to display',
            type: 'USER',
            required: false,
        }],
    },
    async execute(interaction) {
        const userId = interaction.options.getUser('user')?.id ?? interaction.user.id;

        const economy = await Economy.findOne({ userID: userId });
        if (!economy) {
            return interaction.reply({
                content: 'You don\'t have a profile yet. Send !create to create account!',
                ephemeral: true,
            });
        }

        const bank = await Bank.findOne({ userId });
        if (!bank) {
            const newBank = new Bank({
                userId,
            });
            await newBank.save();
        }

        const bankBalance = bank ? bank.balance : "No bank balance";

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Balance for ${interaction.options.getUser('user')?.username ?? interaction.user.username}`)
            .addFields({ name: 'Cash', value: `${economy.balance}`, inline: true }, { name: 'Bank', value: `${bankBalance}`, inline: true }, );

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};