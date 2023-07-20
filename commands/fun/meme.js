const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'meme',
        description: 'Displays a random meme from Giphy.',
    },
    async execute(interaction) {
        const url = 'https://api.giphy.com/v1/gifs/random';
        const apiKey = 'ZYA38wwPYj4QxcPJ61ev82qfxIdhBUuR';
        const params = {
            api_key: apiKey,
            tag: 'meme',
            rating: 'pg-13',
            fmt: 'json',
        };

        try {
            const response = await axios.get(url, { params });
            const gifUrl = response.data.data.images.original.url;

            const embed = new MessageEmbed()
                .setColor('#FFC0CB')
                .setImage(gifUrl);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Sorry, something went wrong.', ephemeral: true });
        }
    },
};