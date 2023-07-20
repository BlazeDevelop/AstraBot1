const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { Economy, RoleShop, Chest } = require('../../models/Economy');

module.exports = {
    data: {
        name: 'addmoney',
        description: 'Add money to a user',
        options: [{
                name: 'user',
                description: 'The user to add money to',
                type: 'USER',
                required: true,
            },
            {
                name: 'amount',
                description: 'The amount of money to add',
                type: 'INTEGER',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        const userData = await Economy.findOne({ userID: user.id });
        if (!userData) {
            return interaction.reply({
                content: 'This user does not have an economy profile yet.',
                ephemeral: true,
            });
        }

        userData.balance += amount;
        userData.save().catch(err => console.log(err));

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setDescription(`Successfully added ${amount} coins to ${user.tag}'s balance. Their new balance is ${userData.balance}.`);

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}