const { SlashCommandBuilder } = require('@discordjs/builders');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get the current weather in a location')
        .addStringOption(option =>
            option.setName('location')
            .setDescription('The location to get the weather for')
            .setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('location');

        weather.find({ search: location, degreeType: 'C' }, (err, result) => {
            if (err) {
                console.log(err);
                return interaction.reply('Sorry, there was an error getting the weather information.');
            }

            if (result.length === 0) {
                return interaction.reply(`Sorry, I couldn't find the weather information for ${location}.`);
            }

            const current = result[0].current;
            const location = result[0].location;

            const weatherEmbed = {
                color: 0x0099ff,
                title: `Weather for ${location.name}, ${location.region}`,
                fields: [{
                        name: 'Temperature',
                        value: `${current.temperature}°C`,
                        inline: true,
                    },
                    {
                        name: 'Feels Like',
                        value: `${current.feelslike}°C`,
                        inline: true,
                    },
                    {
                        name: 'Sky Text',
                        value: current.skytext,
                        inline: true,
                    },
                    {
                        name: 'Humidity',
                        value: `${current.humidity}%`,
                        inline: true,
                    },
                    {
                        name: 'Wind Speed',
                        value: `${current.winddisplay}`,
                        inline: true,
                    },
                ],
                timestamp: new Date(),
            };

            interaction.reply({ embeds: [weatherEmbed] });
        });
    },
};