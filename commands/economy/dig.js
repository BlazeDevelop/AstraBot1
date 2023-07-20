const Discord = require("discord.js");
const { Inventory } = require("../../models/Inventory");
const { Economy } = require("../../models/Economy");

module.exports = {
    data: {
        name: "dig",
        description: "Dig for resources and earn money",
    },
    async execute(interaction) {
        const fiveHours = 5 * 60 * 60 * 1000; // in milliseconds
        const userData = await Economy.findOne({ userId: interaction.user.id });
        const lastDig = userData.lastDig;

        if (lastDig && Date.now() - lastDig < fiveHours) {
            const remainingTime = new Date(lastDig.getTime() + fiveHours) - Date.now();
            const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
            return interaction.reply(`You can't dig yet. Please wait ${remainingHours} hours.`);
        }
        const userInventory = await Inventory.findOne({ userId: interaction.user.id });

        if (!userInventory) {
            return interaction.reply("You don't have an inventory. Use the `create` command to create one.");
        }

        const hasShovel = userInventory.items.some((item) => item.name === "Showel");

        if (!hasShovel) {
            return interaction.reply("You don't have a shovel to dig with.");
        }

        // Set the amount to earn
        const minAmount = 100;
        const maxAmount = 500;
        const amount = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount;

        // Update the user's economy balance and inventory
        const economyResult = await Economy.updateOne({ userId: interaction.user.id }, { $inc: { balance: amount }, lastDig: Date.now() });
        const inventoryResult = await Inventory.updateOne({ userId: interaction.user.id, "items.name": "Earth" }, { $inc: { "items.$.quantity": 1 } });
        if (!economyResult || !inventoryResult) {
            return interaction.reply("An error occurred while trying to dig for earth!");
        }

        return interaction.reply(`You dug up 1 earth and earned ${amount} coins!`);
    },
};