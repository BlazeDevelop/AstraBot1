const { Warn } = require('../../models/Warn');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'clearwarns',
        description: 'Clears all warnings of a mentioned user or all warnings if no user is mentioned',
        options: [{
            name: 'user',
            description: 'The user to clear warnings for (optional)',
            type: 'USER',
            required: false,
        }, ],
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            });
        }
        const user = interaction.options.getUser('user');
        const author = interaction.user;

        if (user && user.bot) {
            return interaction.reply({
                content: 'You cannot clear warnings for bots.',
                ephemeral: true
            });
        }

        if (!user && author.bot) {
            return interaction.reply({
                content: 'You cannot clear all warnings as a bot.',
                ephemeral: true
            });
        }

        if (user && user.id === author.id) {
            return interaction.reply({
                content: 'You cannot clear your own warnings.',
                ephemeral: true
            });
        }

        const query = user ? { userID: user.id } : {};
        const warn = await Warn.findOne(query);
        if (!warn || warn.warns.length === 0) {
            return interaction.reply({
                content: user ? 'This user has no warnings.' : 'There are no warnings to clear.',
                ephemeral: true
            });
        }

        try {
            await Warn.deleteMany(query);
            const successEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(user ? `Warnings for ${user.username} have been cleared.` : 'All warnings have been cleared.');
            return interaction.reply({ embeds: [successEmbed] });
        } catch (error) {
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(user ? `Error clearing warnings for ${user.username}.` : 'Error clearing all warnings.');
            return interaction.reply({ embeds: [errorEmbed] });
        }
    },
};