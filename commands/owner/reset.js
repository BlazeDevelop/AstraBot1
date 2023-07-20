const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Economy } = require('../../models/Economy');
const { Warn } = require('../../models/Warn');
const { Vip } = require('../../models/VIPS');
const { Suggestions } = require('../../models/Suggestions');
const { Inventory } = require('../../models/Inventory');
const { Bank } = require('../../models/Bank');
const { ownerID } = require('../../json/config.json');
const { all } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reset all data in the specified database or all databases.')
        .addStringOption(option =>
            option.setName('name_reset')
            .setDescription('The schema to reset.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const name_reset = interaction.options.getString('name_reset');
        if (interaction.user.id !== ownerID) {
            return interaction.reply({
                content: 'Only the bot owner can use this command.',
                ephemeral: true
            });
        }

        // Reset data in the specified database
        const schema = name_reset.toLowerCase();

        switch (schema) {
            case 'all':
                await Economy.deleteMany({});
                await Warn.deleteMany({});
                await Vip.deleteMany({});
                await Suggestions.deleteMany({});
                await Inventory.deleteMany({});
                await Bank.deleteMany({});
                interaction.reply({
                    content: 'All data has been reset in all databases!'
                });
                break;
            case 'economy':
                await Economy.deleteMany({});
                interaction.reply({
                    content: 'Economy data has been reset!',
                    ephemeral: true
                });
                break;
            case 'warn':
                await Warn.deleteMany({});
                interaction.reply({
                    content: 'Warn data has been reset!',
                    ephemeral: true
                });
                break;
            case 'vip':
                await Vip.deleteMany({});
                interaction.reply({
                    content: 'VIP data has been reset!',
                    ephemeral: true
                });
                break;
            case 'suggestions':
                await Suggestions.deleteMany({});
                interaction.reply({
                    content: 'Suggestions data has been reset!',
                    ephemeral: true
                });
                break;
            case 'lottery':
                await Lottery.deleteMany({});
                interaction.reply({
                    content: 'Lottery data has been reset!',
                    ephemeral: true
                });
                break;
            case 'inventory':
                await Inventory.deleteMany({});
                interaction.reply({
                    content: 'Inventory data has been reset!',
                    ephemeral: true
                });
                break;
            case 'bank':
                await Bank.deleteMany({});
                interaction.reply({
                    content: 'Bank data has been reset!',
                    ephemeral: true
                });
                break;
            default:
                const errorEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Error')
                    .setDescription('Invalid schema specified!');
                interaction.reply({
                    embeds: [errorEmbed],
                    ephemeral: true
                });
                break;
        }
    },
};