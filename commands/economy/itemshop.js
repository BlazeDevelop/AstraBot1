const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Economy } = require('../../models/Economy');
const { Inventory } = require('../../models/Inventory');

const items = [
    { name: 'Laptop', price: 1500 },
    { name: 'Smartphone', price: 1000 },
    { name: 'Headphones', price: 500 },
    { name: 'Gaming Chair', price: 2000 },
    { name: 'Wireless Earbuds', price: 300 },
    { name: 'Smart Watch', price: 800 },
    { name: 'Gaming Console', price: 2500 },
    { name: 'Virtual Reality Headset', price: 3000 },
    { name: 'Drone', price: 1500 },
    { name: 'Camera', price: 1200 },
    { name: 'Pickaxe', price: 2500 },
    { name: 'Axe', price: 2500 },
    { name: 'Showel', price: 2500 }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('itemshop')
        .setDescription('Buy items from the server shop')
        .addSubcommand(subcommand =>
            subcommand
            .setName('list')
            .setDescription('List items available for purchase')
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('buy')
            .setDescription('Buy an item from the shop')
            .addIntegerOption(option =>
                option
                .setName('item')
                .setDescription('The item number to buy')
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'list') {
            let shopList = 'Here are the items available for purchase:\n';
            items.forEach((item, index) => {
                shopList += `${index+1}. ${item.name} - ${item.price} coins\n`;
            });
            const inventoryEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Item Shop')
                .setDescription(shopList);
            return interaction.reply({ embeds: [inventoryEmbed] });
        } else if (subcommand === 'buy') {
            const itemIndex = interaction.options.getInteger('item') - 1;

            if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= items.length) {
                return interaction.reply('Invalid item number. Please provide a valid item number.');
            }

            const item = items[itemIndex];

            const economy = await Economy.findOne({ userID: interaction.user.id });
            if (!economy || economy.balance < item.price) {
                return interaction.reply('You do not have enough coins to purchase this item.');
            }

            const inventory = await Inventory.findOne({ userId: interaction.user.id });
            if (!inventory) {
                const newInventory = new Inventory({
                    userId: interaction.user.id,
                    items: [{ name: item.name }]
                });
                await newInventory.save();
            } else {
                const itemInInventory = inventory.items.find(i => i.name === item.name);
                if (itemInInventory) {
                    itemInInventory.quantity++;
                } else {
                    inventory.items.push({ name: item.name });
                }
                await inventory.save();
            }

            economy.balance -= item.price;
            await economy.save();

            const purchaseEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Item Purchased')
                .setDescription(`Congratulations, you have purchased ${item.name} for ${item.price} coins.`)

            await interaction.reply({ embeds: [purchaseEmbed] });
        }
    }
};