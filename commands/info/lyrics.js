const { SlashCommandBuilder } = require('@discordjs/builders');
const lyricsFinder = require('lyrics-finder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get the lyrics for a song.')
        .addStringOption(option =>
            option.setName('song')
            .setDescription('The name of the song to get the lyrics for.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('artist')
            .setDescription('The name of the artist.')
            .setRequired(true)),
    async execute(interaction) {
        const song = interaction.options.getString('song');
        const artist = interaction.options.getString('artist');

        const lyrics = await lyricsFinder(artist, song) || 'Sorry, no lyrics found.';

        await interaction.reply(`Lyrics for "${song}" by ${artist}:\n\n${lyrics}`);
    },
};