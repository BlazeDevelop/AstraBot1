const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remrole')
        .setDescription('remove role to a member')
        .addUserOption(option => 
            option.setName('member')
                .setDescription('The member to remove the role to')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to remove')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            return await interaction.reply({ content: "You don't have permission to manage roles.", ephemeral: true });
        }

        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');

        if (member.roles.cache.has(role.id)) {
            return await interaction.reply({ content: `${member.user.tag} already has the role ${role.name}.`, ephemeral: true });
        }

        member.roles.remove(role)
            .then(() => {
                const removeRoleEmbed = new MessageEmbed()
                    .setTitle('Role removed')
                    .setColor('RANDOM')
                    .setDescription(`The role ${role.name} has been removed from ${member.user.tag}.`);

                interaction.reply({ embeds: [removeRoleEmbed], ephemeral: true });

                const dmEmbed = new MessageEmbed()
                    .setTitle('Role removed')
                    .setColor('RANDOM')
                    .setDescription(`The role ${role.name} has been removed from you on the server ${interaction.guild.name}.`);

                member.send({ embeds: [dmEmbed] });
            })
            .catch(error => {
                console.error(error);
                interaction.reply({ content: `An error occurred while adding the role ${role.name} to ${member.user.tag}.`, ephemeral: true });
            });
    },
};
