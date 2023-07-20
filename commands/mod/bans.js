const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'bans',
        description: 'Displays a list of current bans',
    },
    async execute(interaction) {
        // Check if user has permission to use the command
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Fetch ban list from server
        const bans = await interaction.guild.bans.fetch();

        // Check if there are no bans
        if (bans.size === 0) {
            return await interaction.reply({ content: 'There are no current bans in this server.', ephemeral: true });
        }

        // Create embed with ban list
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`Current Bans in ${interaction.guild.name}`);

        bans.forEach((ban) => {
            embed.addField(`${ban.user.tag} (${ban.user.id})`, `Reason: ${ban.reason ?? 'None provided.'}`);
        });

        await interaction.reply({ embeds: [embed] });
    },
};