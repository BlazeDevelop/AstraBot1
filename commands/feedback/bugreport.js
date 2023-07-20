const { MessageEmbed } = require('discord.js');
const config = require('../../json/config.json');

module.exports = {
    data: {
        name: 'bugreport',
        description: 'Report a bug to the bot owner',
        options: [{
            name: 'bug',
            type: 'STRING',
            description: 'The bug you want to report',
            required: true,
        }, ],
    },
    async execute(interaction) {
        const bugReport = interaction.options.getString('bug');
        const bugchannel = interaction.client.channels.cache.get('1089585904429051934');
        const owner = interaction.client.users.cache.get(config.ownerID);
        if (!owner) {
            return interaction.reply({ content: 'The bot owner could not be found!', ephemeral: true });
        }

        const embed = new MessageEmbed()
            .setTitle('New bug report!')
            .setDescription(`User ${interaction.user.username} has reported a bug: ${bugReport}!`)
            .setColor('ORANGE')
            .setTimestamp();

        bugchannel.send({ embeds: [embed] });
        owner.send({ embeds: [embed] });

        interaction.reply({ content: 'Bug report sent to the bot owner!', ephemeral: true });
    },
};