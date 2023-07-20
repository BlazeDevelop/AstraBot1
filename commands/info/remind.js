const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: {
        name: 'remind',
        description: 'Installed a remind for a given time',
        type: 'CHAT_INPUT',
        options: [{
                name: 'time',
                description: 'Time to set a reminder',
                type: 'STRING',
                required: true,
            },
            {
                name: 'remind',
                description: 'Text of remind',
                type: 'STRING',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const time = interaction.options.getString('time');
        const reminder = interaction.options.getString('remind');

        // проверка корректности введенного времени
        if (!ms(time)) {
            return interaction.reply('Incorrect time!');
        }

        // установка напоминания
        setTimeout(() => {
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Remind!')
                .setDescription(reminder);

            interaction.user.send({ embeds: [embed] });
        }, ms(time));

        await interaction.reply(`Remind installed in ${time}!`);
    },
};