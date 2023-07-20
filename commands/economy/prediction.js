const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Economy } = require('../../models/Economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prediction')
        .setDescription('Buy a prediction for 2500 coins'),
    async execute(interaction) {
        // Check if user has enough coins to purchase prediction
        const userEconomy = await Economy.findOne({ userID: interaction.user.id });
        if (!userEconomy || userEconomy.balance < 2500) {
            return interaction.reply('You do not have enough coins to purchase a prediction.');
        }

        // Prompt user to confirm the purchase of prediction
        const confirmEmbed = new MessageEmbed()
            .setDescription('Are you sure you want to buy a prediction? Note that it may be incorrect and cannot be refunded!')
            .setColor('#ff0000');
        const confirmRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('yes')
                .setLabel('Yes')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('no')
                .setLabel('No')
                .setStyle('DANGER'),
            );
        await interaction.reply({ embeds: [confirmEmbed], components: [confirmRow], ephemeral: true });

        // Listen for user's confirmation
        const filter = i => i.user.id === interaction.user.id && ['yes', 'no'].includes(i.customId);
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'yes') {
                // Deduct coins from user's balance
                userEconomy.balance -= 2500;
                await userEconomy.save();

                // Generate random prediction
                const chance = Math.floor(Math.random() * 91) + 10;
                const colors = ['RED', 'YELLOW', 'GREEN'];
                const color = colors[Math.floor(Math.random() * 3)];
                const predictionEmbed = new MessageEmbed()
                    .setTitle('Prediction')
                    .setDescription(`With a ${chance}% chance, it is ${color}!`)
                    .setColor(color);
                await interaction.editReply({ embeds: [predictionEmbed], components: [] });
            } else {
                await interaction.editReply('Prediction purchase canceled.');
            }
            collector.stop();
        });

        collector.on('end', async() => {
            // Remove the confirm prompt and buttons after 15 seconds
            if (!interaction.replied) {
                await interaction.deleteReply();
            }
        });
    },
};