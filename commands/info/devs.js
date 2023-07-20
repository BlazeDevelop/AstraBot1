const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'developers',
        description: 'Displays information about the bot developers',
    },
    async execute(interaction) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Developers')
            .setDescription('Information about the bot developers')
            .addFields({ name: 'blazeyt#3344', value: 'Full-stack-dev, QA' }, { name: 'vseyard#8490', value: 'TeamLead' }, );
        await interaction.reply({ embeds: [embed] });
    },
};