const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get an invite link to the server.'),
    async execute(interaction) {
        const invite = await interaction.guild.invites.create(interaction.channel.id, {
            maxAge: 86400,
            maxUses: 1
        });
        await interaction.reply(`Invite link: ${invite.url}`);
    }
};