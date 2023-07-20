const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a specified user by their user ID.')
        .addStringOption(option => option.setName('user_id').setDescription('The user ID of the banned user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for unbanning the user')),

    async execute(interaction) {
        const member = interaction.member;
        if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return interaction.reply('You do not have permission to use this command.');
        }

        const userID = interaction.options.getString('user_id');
        if (!userID) {
            return interaction.reply('You did not specify a user ID to unban.');
        }

        const reason = interaction.options.getString('reason') || 'No reason provided.';
        interaction.guild.bans.fetch(userID)
            .then(banInfo => {
                interaction.guild.members.unban(banInfo.user, reason)
                    .then(() => {
                        banInfo.user.send(`You have been unbanned from the ${interaction.guild.name} server by ${interaction.user.username} for the reason: ${reason}.\nPlease join the server again.`)
                            .catch(error => {
                                console.error(error);
                                interaction.reply(`An error occurred while trying to send a message to ${banInfo.user.username}.`);
                            });

                        const unbanEmbed = new Discord.MessageEmbed()
                            .setColor('#00ff00')
                            .setTitle(`Unbanned User: ${banInfo.user.username}`)
                            .addFields({ name: 'Unbanned By:', value: interaction.user.username }, { name: 'Reason:', value: reason })
                            .setTimestamp();
                        interaction.reply({ embeds: [unbanEmbed] });
                    })
                    .catch(error => {
                        console.error(error);
                        interaction.reply(`An error occurred while trying to unban ${banInfo.user.username}.`);
                    });
            })
            .catch(error => {
                console.error(error);
                interaction.reply(`An error occurred while trying to find a banned user with ID ${userID}.`);
            });
    },
};
