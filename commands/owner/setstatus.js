const { SlashCommandBuilder } = require('@discordjs/builders');
const { ownerID } = require('../../json/config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstatus')
        .setDescription('Set the bot status')
        .addStringOption(option => option.setName('status').setDescription('The new status').setRequired(true)),

    async execute(interaction) {
        const user = interaction.user;

        if (user.id !== ownerID) {
            return interaction.reply('Only the bot owner can use this command.');
        }

        const newStatus = interaction.options.getString('status');

        try {
            await interaction.client.user.setPresence({
                activities: [{ name: newStatus }],
                status: 'online'
            });
            await interaction.reply(`Bot status updated to: ${newStatus}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while updating the bot status.');
        }
    },
};