const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { RoleShop } = require('../../models/Economy');
const betaTestersID = require("../../json/config.json").betaTestersID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Displays available roles for purchase')
        .addStringOption(option =>
            option.setName('role')
            .setDescription('Name of the role to display information for')
            .setRequired(false)
        ),

    async execute(interaction) {

        const roleName = interaction.options.getString('role');
        if (roleName) {
            try {
                const role = await RoleShop.findOne({ roleName: roleName });
                if (!role) {
                    return interaction.reply(`The role "${roleName}" does not exist in the shop.`);
                }

                const embed = new MessageEmbed()
                    .setTitle(`Role: ${roleName}`)
                    .addFields({ name: 'Rarity', value: role.rarity, inline: true }, { name: 'Cost', value: `$${role.cost}`, inline: true }, { name: 'Uploader', value: role.uploader, inline: true }, { name: 'Upload Date', value: role.uploadDate, inline: true }, { name: 'Purchases', value: role.purchases, inline: true });
                return interaction.reply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                return interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
            }
        } else {
            try {
                const roles = await RoleShop.find({});
                if (roles.length === 0) {
                    return interaction.reply('The role shop is currently empty.');
                }

                const roleList = roles.map(role => `- ${role.roleName}`).join('\n');
                const embed = new MessageEmbed()
                    .setTitle('Available Roles')
                    .setDescription(roleList);
                return interaction.reply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                return interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
            }
        }
    }
};