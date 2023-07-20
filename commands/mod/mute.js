const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: {
        name: 'mute',
        description: 'Mutes a user for a specified duration',
        options: [{
                name: 'user',
                description: 'The user to be muted',
                type: 'USER',
                required: true,
            },
            {
                name: 'duration',
                description: 'The duration of the mute (ex: 10m, 1h, 1d)',
                type: 'STRING',
                required: true,
            },
            {
                name: 'reason',
                description: 'The reason for the mute',
                type: 'STRING',
                required: false,
            },
        ],
    },
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply('You do not have sufficient permissions to use this command.');
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            try {
                // Create the "Muted" role with necessary permissions
                const createdRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    permissions: ['SEND_MESSAGES', 'ADD_REACTIONS'],
                });

                // Loop through the channels and deny "SEND_MESSAGES" permission for the "Muted" role
                interaction.guild.channels.cache.forEach(channel => {
                    channel.permissionOverwrites.create(createdRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });

                muteRole = createdRole;
            } catch (error) {
                console.error('Error creating "Muted" role:', error);
                return interaction.reply('An error occurred while creating the "Muted" role.');
            }
        }

        if (user.id === interaction.client.user.id) {
            return interaction.reply({ content: 'I cannot mute myself', ephemeral: true });
        }
        if (user.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot mute yourself', ephemeral: true });
        }
        if (user.bot) {
            return interaction.reply({ content: 'You cannot mute a bot', ephemeral: true });
        }

        if (user.roles.cache.has(muteRole.id)) {
            return interaction.reply('Member is already muted!');
        }

        user.roles.add(muteRole);

        const muteDuration = ms(duration);

        const unmuteTimestamp = new Date(Date.now() + muteDuration);
        const unmuteDate = unmuteTimestamp.toUTCString();

        const embed = new MessageEmbed()
            .setTitle('User Muted')
            .setColor('#ff0000')
            .addField('User', user.tag)
            .addField('Moderator', interaction.user.tag)
            .addField('Reason', reason)
            .addField('Duration', duration)
            .setFooter(`Expires at ${unmuteDate}`);

        await interaction.reply({ embeds: [embed] });

        setTimeout(async() => {
            await user.roles.remove(muteRole);
            const unmuteEmbed = new MessageEmbed()
                .setTitle('User Unmuted')
                .setColor('#00ff00')
                .addField('User', user.tag)
                .setFooter(`Mute duration: ${duration}`);

            interaction.followUp({ embeds: [unmuteEmbed] });
        }, muteDuration);
    },
};