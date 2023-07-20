const { MessageEmbed } = require('discord.js');
const { RoleShop } = require('../../models/Economy');
const betaTestersID = require("../../json/config.json").betaTestersID;

module.exports = {
    data: {
        name: 'setshop',
        description: 'Add a role to the shop',
        options: [{
                name: 'role',
                type: 'ROLE',
                description: 'The role to add to the shop',
                required: true,
            },
            {
                name: 'rarity',
                type: 'STRING',
                description: 'The rarity of the role (rare, very rare, epic, legendary, mystical)',
                required: true,
                choices: [{
                        name: 'Rare',
                        value: 'rare',
                    },
                    {
                        name: 'Very Rare',
                        value: 'very rare',
                    },
                    {
                        name: 'Epic',
                        value: 'epic',
                    },
                    {
                        name: 'Legendary',
                        value: 'legendary',
                    },
                    {
                        name: 'Mystical',
                        value: 'mystical',
                    },
                ],
            },
            {
                name: 'cost',
                type: 'INTEGER',
                description: 'The cost of the role',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have the necessary permissions to use this command.' });
        }

        const role = interaction.options.getRole('role');
        const rarity = interaction.options.getString('rarity');
        const cost = interaction.options.getInteger('cost');

        let minCost = 0;
        switch (rarity.toLowerCase()) {
            case 'rare':
                minCost = 100;
                break;
            case 'very rare':
                minCost = 500;
                break;
            case 'epic':
                minCost = 1500;
                break;
            case 'legendary':
                minCost = 5000;
                break;
            case 'mystical':
                minCost = 20000;
                break;
            default:
                return interaction.reply({ content: 'Invalid rarity specified. Rarity must be one of the following: rare, very rare, epic, legendary, mystical.' });
        }

        if (cost < minCost) {
            return interaction.reply({ content: `Cost must be at least ${minCost} for rarity ${rarity}.` });
        }

        const newRole = new RoleShop({
            roleName: role.name,
            rarity: rarity,
            cost: cost,
            addedBy: interaction.user.username,
        });

        try {
            await newRole.save();
            const embed = new MessageEmbed()
                .setTitle(`Role ${role.name} added to shop`)
                .addField('Rarity', rarity, true)
                .addField('Cost', `$${cost}`, true)
                .addField('Added By', interaction.user.username, true);
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            return interaction.reply({ content: `An error occurred while saving the role to the database: ${error}` });
        }
    },
};