const { CommandInteraction, MessageEmbed } = require('discord.js');
const { Suggestions } = require('../../models/Suggestions');
const betaTestersID = require('../../json/config.json').betaTestersID;

module.exports = {
    data: {
        name: 'suggest',
        description: 'Sends a suggestion to the suggestions channel.',
        options: [{
            name: 'suggestion',
            type: 'STRING',
            description: 'The suggestion to send',
            required: true,
        }, ],
    },
    async execute(interaction = new CommandInteraction()) {

        // The ID of the channel to send the suggestion to
        const channelId = '1089586322336907416';

        // The author's ID
        const authorId = interaction.user.id;

        // The text of the suggestion
        const suggestion = interaction.options.getString('suggestion');

        // Create a new suggestion document
        const newSuggestion = new Suggestions({
            suggestionNum: Date.now(),
            authorId,
            suggestion,
            status: 'Pending',
        });

        // Save the new suggestion to the database
        await newSuggestion.save().catch((err) => {
            console.error(err);
            interaction.reply('There was an error saving your suggestion. Please try again later.');
            return;
        });

        // Find the channel to send the suggestion to
        const channel = interaction.guild.channels.cache.find((ch) => ch.id === channelId);

        // Create an embed for the suggestion
        const suggestionEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Suggestion #${newSuggestion.suggestionNum}`)
            .addField('Author', interaction.user.username)
            .addField('Suggestion', suggestion)
            .setFooter('Awaiting review...');

        // Send the suggestion to the channel
        channel
            .send({ embeds: [suggestionEmbed] })
            .then((sentMessage) => {
                // Add the upvote and downvote reactions
                sentMessage.react('👍');
                sentMessage.react('👎');

                // Confirm that the suggestion was sent
                interaction.reply('Your suggestion has been sent!');
            })
            .catch((err) => {
                console.error(err);
                interaction.reply('There was an error sending your suggestion. Please try again later.');
            });
    },
};