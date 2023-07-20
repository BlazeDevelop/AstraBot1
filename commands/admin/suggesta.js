const { MessageEmbed } = require('discord.js');
const { Suggestions } = require("../../models/Suggestions");
const betaTestersID = require("../../json/config.json").betaTestersID;

module.exports = {
    data: {
        name: 'suggesta',
        description: 'Answer to suggest',
        options: [{
                name: 'suggestion_number',
                description: 'The number of the suggestion to respond to',
                type: 'INTEGER',
                required: true,
            },
            {
                name: 'status',
                description: 'The status of the suggestion (accept/decline)',
                type: 'STRING',
                required: true,
                choices: [{
                        name: 'Accept',
                        value: 'accept',
                    },
                    {
                        name: 'Decline',
                        value: 'decline',
                    },
                ],
            },
        ],
    },
    async execute(interaction) {

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have sufficient permissions to perform this action.' });
        }

        const suggestionNum = interaction.options.getInteger('suggestion_number');
        const status = interaction.options.getString('status').toLowerCase();

        if (status !== 'accept' && status !== 'decline') {
            return interaction.reply({ content: 'Invalid status, please use either `accept` or `decline`.' });
        }

        const suggestion = await Suggestions.findOne({ suggestionNum });

        if (!suggestion) {
            return interaction.reply({ content: 'No suggestion found with that number.' });
        }

        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`Suggestion ${suggestionNum} was ${status === "accept" ? "accepted" : "declined"}`)
            .setDescription(suggestion.suggestion)
            .setFooter(`Suggestion ${status === "accept" ? "accepted" : "declined"} by ${interaction.user.username}`);

        suggestion.status = status;

        try {
            await suggestion.save();
            const channel = interaction.guild.channels.cache.find(channel => channel.id === '1073950238185893938');
            await channel.send({ embeds: [embed] });
            return interaction.reply({ content: `Suggestion ${suggestionNum} has been ${status === 'accept' ? 'accepted' : 'declined'}.` });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'An error occurred while saving the updated suggestion to the database.' });
        }
    },
};