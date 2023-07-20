const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));


module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Get the definition of a word.')
        .addStringOption(option =>
            option.setName('word')
            .setDescription('The word to define.')
            .setRequired(true)),
    async execute(interaction) {
        const word = interaction.options.getString('word');
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (!data.title && data[0] && data[0].meanings[0] && data[0].meanings[0].definitions[0]) {
            const definition = data[0].meanings[0].definitions[0].definition;
            await interaction.reply(`The definition of "${word}" is: ${definition}`);
        } else {
            await interaction.reply(`Sorry, the definition of "${word}" could not be found.`);
        }
    },
};