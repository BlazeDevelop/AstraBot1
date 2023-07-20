const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: {
        name: 'wiki',
        description: 'Search for a topic on Wikipedia',
        options: [{
            name: 'topic',
            description: 'The topic to search for',
            type: 'STRING',
            required: true,
        }],
    },
    async execute(interaction) {
        const query = interaction.options.getString('topic');
        const url = `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(url);

            const embed = new MessageEmbed()
                .setTitle(response.data.title)
                .setURL(response.data.content_urls.desktop.page)
                .setDescription(response.data.extract)
                .setColor('#007FFF')
                .setThumbnail(response.data.thumbnail?.source ?? '')
                .setFooter('Wikipedia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while searching for the topic on Wikipedia.');
        }
    },
};
