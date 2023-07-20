const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'forceban',
        description: 'Bans a user by their ID, even if they are not on the server',
        options: [{
                name: 'user',
                description: 'The ID of the user to ban',
                type: 'STRING',
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for the ban',
                type: 'STRING',
                required: true,
            },
        ],
    },
    guildOnly: true,
    execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            });
        }
        const userID = interaction.options.getString('user');
        const reason = interaction.options.getString('reason');

        const bannedEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`Ban | ${userID}`)
            .addField('Banned User', `<@${userID}>`, true)
            .addField('Banned By', `<@${interaction.user.id}>`, true)
            .addField('Reason', reason)
            .setFooter(`ID: ${userID}`)
            .setTimestamp();

        interaction.guild.members.ban(userID, { reason: reason })
            .then(() => {
                interaction.reply({ embeds: [bannedEmbed] });
            })
            .catch(error => {
                console.error(error);
                interaction.reply('There was an error trying to ban the user. Please try again later.');
            });
    },
};