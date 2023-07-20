const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Rob a user and take their balance')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user you want to rob')
            .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const robber = await Economy.findOne({ userID: interaction.user.id });
        const target = await Economy.findOne({ userID: targetUser.id });

        // Check if the target user is the same as the robber
        if (targetUser.id === interaction.user.id) {
            return interaction.reply("You can't rob yourself!");
        }

        // Check if the robber is already in cooldown
        if (robber.lastRobbery && (Date.now() - robber.lastRobbery) / 1000 / 60 / 60 < 5) {
            const timeRemaining = 5 - (Date.now() - robber.lastRobbery) / 1000 / 60 / 60;
            return interaction.reply(`You are in robbery cooldown! Please wait ${timeRemaining.toFixed(0)} more hours.`);
        }

        // Check if the user has permission to use the command
        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        // Check if the target user has a balance to rob
        if (!target) {
            return interaction.reply('That user doesn\'t have a balance to rob!');
        }

        // Determine the amount of money to rob
        const robAmount = Math.floor(Math.random() * (10 - 1 + 1) + 1) / 100 * target.balance;

        // Update the balances
        if (Math.random() < 0.5) { // Adding probability of losing all balance when robbed
            robber.balance = 0;
            robber.save();
            return interaction.reply(`While you were robbing ${targetUser.username}, they called the police and you lost all your money to pay your way out of jail.`);
        } else {
            robAmount >= 0.5 ? target.balance -= Math.ceil(robAmount) : target.balance -= Math.floor(robAmount);
            robAmount >= 0.5 ? robber.balance += Math.ceil(robAmount) : robber.balance += Math.floor(robAmount);
            target.save();
            robber.lastRobbery = Date.now();
            robber.save();

            // Send a confirmation message
            return interaction.reply(`${interaction.user.username} has robbed ${targetUser.username} and took $${Math.round(robAmount)}!`);
        }
    },
};