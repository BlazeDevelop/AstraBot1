const { MessageEmbed } = require('discord.js');
const { Economy, RoleShop } = require('../../models/Economy');

module.exports = {
    data: {
        name: 'buy',
        description: 'Allows a user to purchase a role from the shop',
        options: [{
            name: 'role',
            type: 'STRING',
            description: 'The name of the role you want to purchase',
            required: true,
        }, ],
    },
    async execute(interaction) {
        // Get the user's Discord ID
        const userID = interaction.user.id;

        // Get the name of the role the user wants to purchase
        const roleName = interaction.options.getString('role');

        // Find the role in the shop
        const role = await RoleShop.findOne({ roleName: roleName });

        // Check if the role exists in the shop
        if (!role) {
            return interaction.reply(`The role "${roleName}" does not exist in the shop.`);
        }

        // Find the user's economy data
        const economyData = await Economy.findOne({ userID: userID });

        // Check if the user has enough money to purchase the role
        if (economyData.balance < role.cost) {
            return interaction.reply(`You do not have enough money to purchase the role "${roleName}".`);
        }

        // Get the guild that the interaction was triggered in
        const guild = interaction.guild;

        // Get the role object from the guild
        const purchasedRole = guild.roles.cache.find(r => r.name === roleName);

        // Check if the user already has the role
        if (interaction.member.roles.cache.has(purchasedRole.id)) {
            return interaction.reply(`You already have the role "${roleName}".`);
        }

        // Deduct the cost of the role from the user's balance
        economyData.balance -= role.cost;
        await economyData.save();

        // Add the role to the user
        await interaction.member.roles.add(purchasedRole)
            .then(() => {
                // Confirm that the role was added
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Role Purchased - ${roleName}`)
                    .setDescription(`You have successfully purchased the role "${roleName}" for $${role.cost}.`)
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            })
            .catch(err => {
                console.error(err);
                return interaction.reply(`There was an error adding the role "${roleName}" to you. Please contact an administrator.`);
            });
    },
};