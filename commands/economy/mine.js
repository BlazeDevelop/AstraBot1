const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { Inventory } = require('../../models/Inventory');
const { Economy } = require('../../models/Economy');
const betaTestersID = require('../../json/config.json').betaTestersID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mine')
        .setDescription('Mine for ores and earn money'),
    async execute(interaction) {
        // Only allow beta testers to use this command
        if (interaction.user.id !== betaTestersID) {
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setColor('#000000')
                .setDescription('This command is under development.');
            return interaction.reply({ embeds: [embed] });
        }

        const item = 'Pickaxe'; // Required tool for mining ores
        const priceRange = [100, 500]; // Range of possible earnings from mining

        // Check if user has the required tool in their inventory
        const inventory = await Inventory.findOne({ userID: interaction.user.id });
        const pickaxe = inventory.items.find((item) => item.name === 'Pickaxe');

        if (!pickaxe) {
            return interaction.reply('You need a pickaxe to mine for ores!');
        }

        // Check if user is on mining cooldown
        const fiveHours = 5 * 60 * 60 * 1000; // in milliseconds
        const userData = await Economy.findOne({ userID: interaction.user.id });
        const lastMining = userData.lastMining;

        if (lastMining && Date.now() - lastMining < fiveHours) {
            const remainingTime = new Date(lastMining.getTime() + fiveHours) - Date.now();
            const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
            return interaction.reply(`You can't mine yet. Please wait ${remainingHours} hours.`);
        }

        // Calculate earnings from mining
        const randomPrice = Math.floor(Math.random() * (priceRange[1] - priceRange[0] + 1)) + priceRange[0];
        await Economy.findOneAndUpdate({ userID: interaction.user.id }, { $inc: { balance: randomPrice }, lastMining: Date.now() }, { upsert: true });

        // Send a confirmation message
        interaction.reply(`You mined for some ores and earned ${randomPrice} coins!`);
    },
};