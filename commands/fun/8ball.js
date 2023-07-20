const { MessageEmbed } = require('discord.js');

const cooldowns = new Map();

module.exports = {
    data: {
        name: '8ball',
        description: 'Answers a yes/no question with a random response.',
        options: [{
            name: 'question',
            description: 'The question to ask',
            type: 'STRING',
            required: true,
        }, ],
    },
    async execute(interaction) {
        const question = interaction.options.getString('question');

        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id) + 1000;
            if (Date.now() < expirationTime) {
                const remainingTime = (expirationTime - Date.now()) / 1000;
                return interaction.reply({
                    content: `Please wait ${remainingTime.toFixed(1)} more second(s) before using this command again.`,
                    ephemeral: true,
                });
            }
        }

        const responses = [
            'Yes.',
            'No.',
            'Maybe.',
            'Ask again later.',
            'Definitely not.',
            'Of course!',
            'I am not sure.',
            'It is certain.',
            'Without a doubt.',
            'Very likely.',
            'I don\'t think so.',
            'It is possible.',
            'Probably not.',
            'You may rely on it.',
            'Better not tell you now.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('8Ball')
            .setDescription(`${response}`)
            .setFooter(`Requested by ${interaction.user.username}`, interaction.user.avatarURL());

        await interaction.reply({ embeds: [embed] });

        cooldowns.set(interaction.user.id, Date.now());
    },
};