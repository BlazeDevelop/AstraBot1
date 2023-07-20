const Discord = require("discord.js");
const { Inventory } = require("../../models/Inventory");
const { Economy } = require("../../models/Economy");

module.exports = {
    data: {
        name: "chop",
        description: "Chop down trees and earn money",
    },
    async execute(interaction) {
        const item = "Axe"; // Требуемый инструмент для добычи дерева
        const priceRange = [100, 500]; // диапазон возможного дохода от добычи

        const inventory = await Inventory.findOne({ userID: interaction.user.id });
        const axe = inventory.items.find(item => item.name === "Axe");

        if (!axe) {
            return interaction.reply(`You need an axe to chop down trees!`);
        }

        const cooldownDuration = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
        const userData = await Economy.findOne({ userID: interaction.user.id });
        const lastChopping = userData.lastChopping;

        if (lastChopping && Date.now() - lastChopping < cooldownDuration) {
            const remainingTime = lastChopping + cooldownDuration - Date.now();
            const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
            return interaction.reply(`You can't chop yet. Please wait ${remainingHours} hours.`);
        }

        const randomPrice = Math.floor(Math.random() * (priceRange[1] - priceRange[0] + 1)) + priceRange[0];
        await Economy.findOneAndUpdate({ userID: interaction.user.id }, { $inc: { balance: randomPrice }, lastChopping: Date.now() }, { upsert: true });

        interaction.reply(`You chopped down some trees and earned ${randomPrice} coins!`);
    }
};