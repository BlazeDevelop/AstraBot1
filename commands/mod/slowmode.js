const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slowmode for a channel')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel to set the slowmode for')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('delay')
            .setDescription('The slowmode delay in seconds')
            .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const delay = interaction.options.getInteger('delay');

        if (!channel) {
            return interaction.reply('Please provide a valid channel.');
        }

        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return interaction.reply('You do not have permission to manage channels.');
        }

        if (delay === 0) {
            await channel.setRateLimitPerUser(0, `Slowmode disabled by ${interaction.user.tag}`);
            return interaction.reply(`Slowmode for ${channel} disabled.`);
        } else {
            await channel.setRateLimitPerUser(delay, `Slowmode set by ${interaction.user.tag}`);
            return interaction.reply(`Slowmode for ${channel} set to ${delay} seconds.`);
        }
    }
};