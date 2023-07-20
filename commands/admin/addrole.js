const { MessageEmbed } = require('discord.js');

module.exports = {
    data: {
        name: 'addrole',
        description: 'Add role to a member',
        options: [{
                name: 'member',
                description: 'The member to add the role to',
                type: 'USER',
                required: true,
            },
            {
                name: 'role',
                description: 'The role to add',
                type: 'ROLE',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'You do not have permissions to use this command.',
                ephemeral: true
            });
        }

        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');

        if (member.roles.cache.has(role.id)) {
            return interaction.reply(`${member.user.tag} already has the role ${role.name}.`);
        }

        member.roles.add(role)
            .then(() => {
                const addRoleEmbed = new MessageEmbed()
                    .setTitle('Role added')
                    .setColor('RANDOM')
                    .setDescription(`The role ${role.name} has been added to ${member.user.tag}.`);
                interaction.reply({ embeds: [addRoleEmbed] });

                const dmEmbed = new MessageEmbed()
                    .setTitle('Role added')
                    .setColor('RANDOM')
                    .setDescription(`The role ${role.name} has been added to you on the server ${interaction.guild.name}.`)
                member.send({ embeds: [dmEmbed] });
            })
            .catch(error => {
                console.error(error);
                interaction.reply(`An error occurred while adding the role ${role.name} to ${member.user.tag}.`);
            });
    },
};