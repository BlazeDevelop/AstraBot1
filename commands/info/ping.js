const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'ping',
        description: 'Ping the bot and get a response time',
    },
    async execute(interaction) {
        const startTime = Date.now();

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription('Calculating ping...')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });

        const endTime = Date.now();
        const ping = endTime - startTime;

        const pingEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Pong!')
            .setDescription(`Ping: ${ping}ms`)
            .setTimestamp();

        await interaction.editReply({ embeds: [pingEmbed] });
    },
};