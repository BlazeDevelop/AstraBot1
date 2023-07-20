const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from the current channel.')
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('The number of messages to clear.')
            .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        // Check if the user has the "MANAGE_MESSAGES" permission
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Check if the amount of messages to clear is within the range of 1 to 100
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'The amount of messages to clear must be between 1 and 100.', ephemeral: true });
        }

        // Clear the messages
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: amount + 1 });

        try {
            await channel.bulkDelete(messages);
            const successEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('Messages Cleared')
                .setDescription(`${amount} messages have been cleared from this channel.`);
            interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription(`Some messages could not be cleared.\n${error}`);
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};