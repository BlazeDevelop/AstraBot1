const { MessageEmbed } = require("discord.js");

module.exports = {
    data: {
        name: "findid",
        description: "Find the ID of a mentioned user",
        options: [{
            name: "user",
            description: "Mention a user to get their ID",
            type: "USER",
            required: true,
        }],
    },
    async execute(interaction, client) {
        const mentionedUser = interaction.options.getUser("user");

        const embed = new MessageEmbed()
            .setTitle(`User ID`)
            .setColor(0x00ff00)
            .setDescription(`The ID of ${mentionedUser.username} is ${mentionedUser.id}`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};