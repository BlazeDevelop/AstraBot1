const { SlashCommandBuilder } = require('@discordjs/builders');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Go on an adventure'),

    async execute(interaction) {
        const user = interaction.user;

        try {
            // Find the user's economy data
            let economyData = await Economy.findOne({ userID: user.id });

            if (!economyData) {
                // If economy data doesn't exist, create a new entry
                economyData = new Economy({ userID: user.id });
            } else {
                // Check if enough time has passed since the last search
                const lastSearch = economyData.lastSearch;
                const cooldown = 1 * 60 * 60 * 1000; // 1 hour cooldown

                if (lastSearch && Date.now() - lastSearch < cooldown) {
                    const remainingTime = cooldown - (Date.now() - lastSearch);
                    return interaction.reply(`You need to wait ${formatTime(remainingTime)} before going on another adventure.`);
                }
            }

            // Generate a random amount of coins earned from the adventure (between 100 and 1000)
            const coinsEarned = Math.floor(Math.random() * 901) + 100;

            // Update the economy data
            economyData.balance += coinsEarned;
            economyData.lastSearch = Date.now();
            await economyData.save();

            interaction.reply(`You went on an adventure and found ${coinsEarned} coins!`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    },
};

// Helper function to format time in HH:MM:SS format
function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}