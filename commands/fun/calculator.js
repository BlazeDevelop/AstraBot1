const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'calculator',
        description: 'Performs basic calculations',
        options: [{
            name: 'equation',
            type: 'STRING',
            description: 'The equation to calculate',
            required: true,
        }, ],
    },
    execute(interaction) {
        const equation = interaction.options.getString('equation');

        try {
            const result = eval(equation);
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Calculation Result')
                .addField('Equation:', `\`\`\`${equation}\`\`\``)
                .addField('Result:', `\`\`\`${result}\`\`\``)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            interaction.reply('Error: Invalid equation.');
        }
    },
};