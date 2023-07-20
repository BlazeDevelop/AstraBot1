const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'ban',
        description: 'Bans a specified user from the server',
        options: [{
                name: 'user',
                description: 'The user to ban',
                type: 'USER',
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for the ban',
                type: 'STRING',
                required: false,
            }
        ],
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            });
        }
        const member = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        if (!member.bannable) {
            return await interaction.reply({ content: 'I cannot ban this user', ephemeral: true });
        }

        const banEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`Banned User: ${member.user.username}`)
            .addFields({ name: 'Banned By:', value: interaction.user.username }, { name: 'Reason:', value: reason })
            .setTimestamp()
            .setFooter(`ID: ${member.user.id}`);
        await interaction.reply({ embeds: [banEmbed] });

        await member.send(`You have been banned from ${interaction.guild.name} by ${interaction.user.username} for the reason: ${reason}`)
            .catch(error => console.log(`Failed to send DM to ${member.user.tag}`));

        await member.ban({ reason: reason });
    },
};