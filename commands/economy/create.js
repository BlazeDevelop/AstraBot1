const { Economy } = require("../../models/Economy");
const { Inventory } = require("../../models/Inventory");

module.exports = {
    data: {
        name: "create",
        description: "Create a new user in the economy systems",
    },
    async execute(interaction) {
        // Check if user already exists in both systems
        const economyAccount = await Economy.findOne({ userID: interaction.user.id });

        if (economyAccount) {
            return interaction.reply("You already exist in the economy systems.");
        }

        // Create new user in economy and bank systems
        const newEconomyUser = new Economy({
            userID: interaction.user.id,
            balance: 100,
        });
        await newEconomyUser.save();

        // Create new user profile in inventory system
        const newInventoryUser = new Inventory({
            userId: interaction.user.id,
            items: [],
        });
        await newInventoryUser.save();

        return interaction.reply("You have been successfully added to the economy and inventory systems.");
    },
};