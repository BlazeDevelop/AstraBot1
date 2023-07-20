const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Displays the user\'s avatar')
        .addUserOption(option => option.setName('user').setDescription('The user\'s avatar to display').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        // Get avatar URL and image type
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 2048 });
        const avatarType = avatarURL.slice(avatarURL.lastIndexOf('.') + 1);

        // Create embed
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarURL)
            .setDescription(`**Resolution:** ${avatarType === 'gif' ? 'original' : '2048x2048'}\n**Type:** ${avatarType.toUpperCase()}`);

        // Create buttons
        const resolutionButton = new MessageButton()
            .setCustomId('resolution')
            .setLabel('Resolution')
            .setStyle('SECONDARY')
            .setEmoji('🔍');
        const extensionButton = new MessageButton()
            .setCustomId('extension')
            .setLabel('Extension')
            .setStyle('SECONDARY')
            .setEmoji('📂');
        const linkButton = new MessageButton()
            .setLabel('Link')
            .setStyle('LINK')
            .setURL(avatarURL);

        // Create action row
        const actionRow = new MessageActionRow()
            .addComponents(resolutionButton, extensionButton, linkButton);

        // Send message with embed and buttons
        await interaction.reply({ embeds: [embed], components: [actionRow] });

        // Create filter for button interaction
        const filter = i => i.customId === 'resolution' || i.customId === 'extension';

        // Create button collector
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

        // Listen for button interactions
        collector.on('collect', async i => {
            if (i.customId === 'resolution') {
                const resolutionEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${user.username}'s Avatar Resolution`)
                    .setImage(avatarURL)
                    .setDescription(`**Resolution:** ${avatarType === 'gif' ? 'original' : '2048x2048'}`);

                await i.update({ embeds: [resolutionEmbed], components: [actionRow] });
            } else if (i.customId === 'extension') {
                const extensionEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`${user.username}'s Avatar Extension`)
                    .setImage(avatarURL)
                    .setDescription(`**Type:** ${avatarType.toUpperCase()}`);

                await i.update({ embeds: [extensionEmbed], components: [actionRow] });
            }
        });

        // Listen for button interaction timeout
        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.editReply({ components: [] });
            }
        });
    },
};