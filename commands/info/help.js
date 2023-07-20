const { MessageSelectMenu, MessageActionRow } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Displays help information for the bot commands.',
    },
    async execute(interaction) {
        const categories = ['admin', 'economy', 'fun', 'games', 'info', 'mod', 'owner', 'feedback'];

        // Create an interactive message with a select menu for category selection
        const selectMenu = new MessageSelectMenu()
            .setCustomId('category-select')
            .setPlaceholder('Select a category')
            .addOptions(categories.map(category => {
                return {
                    label: category.toUpperCase(),
                    value: category
                }
            }));

        const actionRow = new MessageActionRow().addComponents(selectMenu);

        // Send the message to the user
        await interaction.reply({ content: 'Please select a category:', components: [actionRow], ephemeral: true });

        // Await user selection
        const filter = interaction => interaction.customId === 'category-select' && interaction.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async interaction => {
            const category = interaction.values[0];

            // Read commands from the selected category directory
            const fs = require('fs');
            const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));

            // Create a list of commands for the selected category
            const commandList = commands.map(file => {
                const command = require(`../${category}/${file}`);
                return `- **/${command.data.name}**: ${command.data.description}`;
            });

            // If there are no commands in the selected category, show a message to the user
            if (commandList.length === 0) {
                await interaction.reply({ content: 'No commands found in this category', ephemeral: true });
            } else {
                await interaction.reply({ content: `Commands in category **${category.toUpperCase()}**: \n\n${commandList.join('\n')}`, ephemeral: true });
            }
        });

        collector.on('end', async collected => {
            // If the user didn't make a selection, show a message to the user
            if (collected.size === 0) {
                await interaction.reply({ content: 'No selection was made', ephemeral: true });
            }
        });
    },
};
//я даю тебе код команды help и ты должен сделать ее более кликабельной обеспечить удобство использование команды и разработать красивый дизайн