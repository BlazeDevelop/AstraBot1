const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duel')
        .setDescription('Initiates a duel with another player')
        .addUserOption(option =>
            option.setName('user') // Укажите имя параметра здесь
            .setDescription('The player to duel')
            .setRequired(true)
        ),

    async execute(interaction) {
        const { member, guild } = interaction;
        const user = interaction.options.getUser('user');

        if (user.bot) {
            return interaction.reply('You cannot duel a bot!');
        }

        if (user.id === member.id) {
            return interaction.reply('You cannot duel yourself!');
        }

        if (!guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            return interaction.reply('I do not have permission to kick members.');
        }

        const participants = [member, user];
        const winner = participants[Math.floor(Math.random() * participants.length)];
        const loser = participants.find(p => p !== winner);

        await interaction.reply(`${winner} has won the duel!`);
        await guild.members.kick(loser, 'Lost the duel');
    },
};