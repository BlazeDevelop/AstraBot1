const { MessageEmbed } = require('discord.js');
const { ownerID } = require('../../json/config.json');

module.exports = {
    data: {
        name: 'eval',
        description: 'Evaluates arbitrary JavaScript code.',
        options: [{
            name: 'code',
            description: 'The code to evaluate',
            type: 'STRING',
            required: true,
        }, ],
    },
    async execute(interaction) {
        if (interaction.user.id !== ownerID) {
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setColor('#000000')
                .setDescription('You are not the owner of the bot.')
                .setFooter('Evaluation failed');
            await interaction.reply({ embeds: [embed] });
            return;
        }

        try {
            const code = interaction.options.getString('code');
            let evaled = eval(code);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);

            const codeLength = code.length;
            const embed = new MessageEmbed()
                .setTitle('Output Console')
                .setColor('#000000')
                .setDescription(evaled)
                .setFooter(`Executed in ${Math.round(process.uptime())}ms. \nCharacter count: ${codeLength}`);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            const codeLength = interaction.options.getString('code').length;
            const embed = new MessageEmbed()
                .setTitle('Error')
                .setColor('#000000')
                .setDescription(error.toString())
                .setFooter(`Executed in ${Math.round(process.uptime())}ms. \nCharacter count: ${codeLength}`);
            await interaction.reply({ embeds: [embed] });
        }
    },
};