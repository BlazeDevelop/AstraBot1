const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerID } = require('../../json/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the bot'),

    async execute(interaction) {
        const user = interaction.user;

        if (user.id !== ownerID) {
            return interaction.reply('Only the bot owner can use this command.');
        }

        try {
            await interaction.reply('Stopping the bot...');
            await interaction.client.destroy();
            process.exit(0);
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while stopping the bot.');
        }
    },
};