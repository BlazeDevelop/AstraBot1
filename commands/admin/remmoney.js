const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remmoney')
        .setDescription('Remove money from a user')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user to remove money from')
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('The amount of money to remove')
            .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return await interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        const userData = await Economy.findOne({ userID: user.id });
        if (!userData) {
            return await interaction.reply({ content: 'This user does not have an economy profile yet.', ephemeral: true });
        }

        userData.balance -= amount;
        await userData.save();

        return await interaction.reply({ content: `Successfully removed ${amount} coins from ${user.tag}'s balance. Their new balance is ${userData.balance}.`, ephemeral: true });
    },
};