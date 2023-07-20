const { MessageEmbed } = require('discord.js');
const { Inventory } = require('../../models/Inventory');

module.exports = {
    data: {
        name: 'inventory',
        description: 'Displays the user inventory',
    },
    async execute(interaction) {
        const inventory = await Inventory.findOne({ userId: interaction.user.id });

        if (!inventory) {
            return interaction.reply('Your inventory is empty');
        }

        const inventoryEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${interaction.user.username}'s Inventory`);

        for (const item of inventory.items) {
            inventoryEmbed.addField(item.name, item.quantity);
        }

        interaction.reply({ embeds: [inventoryEmbed] });
    },
};