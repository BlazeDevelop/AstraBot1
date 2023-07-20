const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Get a random picture of a dog.'),
    async execute(interaction) {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();

        const embed = new MessageEmbed()
            .setTitle('Random Dog')
            .setImage(data.message)
            .setColor('RANDOM')
            .setFooter('Powered by Dog CEO API');

        await interaction.reply({ embeds: [embed] });
    },
};