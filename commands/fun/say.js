const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('The bot repeats the message sent by the user')
        .addStringOption(option =>
            option.setName('message')
            .setDescription('The message you want the bot to repeat')
            .setRequired(true)
        ),
    async execute(interaction) {
        const messageToSay = interaction.options.getString('message');
        await interaction.reply(messageToSay);
    },
};
