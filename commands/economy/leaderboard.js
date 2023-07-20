const { SlashCommandBuilder } = require('@discordjs/builders');
const { Economy } = require("../../models/Economy");
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard of the server'),
    async execute(interaction) {
        try {
            const results = await Economy.find({ serverID: interaction.guild.id }).sort({ balance: -1 }).limit(10);
            const embed = new MessageEmbed()
                .setTitle('Leaderboard')
                .setColor('RANDOM')
                .setTimestamp();

            results.forEach((result, index) => {
                embed.addField(`#${index + 1}`, `<@${result.userID}> - ${result.balance} coins`);
            });

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await interaction.reply('An error occurred while trying to fetch the leaderboard.');
        }
    },
};