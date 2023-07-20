const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'idea',
        description: 'Submits a new idea',
        options: [{
            name: 'idea',
            type: 'STRING',
            description: 'The idea you want to submit',
            required: true,
        }, ],
    },
    async execute(interaction) {
        const ideaChannel = interaction.client.channels.cache.get('1090166297205162054');
        if (!ideaChannel) {
            return interaction.reply({ content: 'Idea channel not found' });
        }

        const ideaContent = interaction.options.getString('idea');
        if (!ideaContent) {
            return interaction.reply({ content: 'Please provide an idea' });
        }

        const ideaEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('New idea')
            .setDescription(ideaContent)
            .setFooter(`Submitted by ${interaction.user.tag} on ${new Date().toLocaleString()}`);

        const sentEmbed = await ideaChannel.send({ embeds: [ideaEmbed] });
        await sentEmbed.react('👍');
        await sentEmbed.react('👎');

        interaction.reply({ content: 'Idea submitted' });
    },
};