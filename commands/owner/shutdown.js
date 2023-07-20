const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerID } = require('../../json/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shuts down the bot.'),
    async execute(interaction) {
        if (interaction.user.id !== ownerID) {
            return interaction.reply({
                content: 'This command is developer only!',
                ephemeral: true,
            });
        }

        await interaction.reply({ content: 'Shutting down...', ephemeral: true });

        // Destroy the client to shut down the bot
        await interaction.client.destroy();
    },
};