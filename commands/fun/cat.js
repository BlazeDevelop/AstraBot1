const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Get a random picture of a cat.'),
    async execute(interaction) {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await response.json();

        const embed = new MessageEmbed()
            .setTitle('Random Cat')
            .setImage(data[0].url)
            .setColor('RANDOM')
            .setFooter('Powered by TheCatAPI');

        await interaction.reply({ embeds: [embed] });
    },
};