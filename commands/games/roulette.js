const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { Economy } = require('../../models/Economy');
const { Vip } = require('../../models/VIPS');

module.exports = {
    data: {
        name: 'roulette',
        description: 'Play a game of roulette and win or lose money',
        options: [{
                type: 'STRING',
                name: 'color',
                description: 'The color you want to bet on (red, green, or yellow)',
                required: true
            },
            {
                type: 'INTEGER',
                name: 'bet',
                description: 'The amount of money you want to bet',
                required: true
            }
        ]
    },
    async execute(interaction) {
        const minimumBet = 500;
        const colors = ['red', 'green', 'yellow'];
        const color = interaction.options.getString('color');
        const bet = interaction.options.getInteger('bet');

        if (!colors.includes(color)) {
            return interaction.reply('Please specify a valid color (red, green, yellow)');
        }

        if (!bet || isNaN(bet) || bet < minimumBet) {
            return interaction.reply(`Please specify a valid bet, minimum bet is ${minimumBet} coins.`);
        }

        const economy = await Economy.findOne({ userID: interaction.user.id }).exec();
        if (!economy) {
            const newUser = new Economy({
                userID: interaction.user.id,
                balance: 100,
                lastWork: Date.now()
            });
        }

        if (economy.balance < bet) {
            return interaction.reply(`You do not have enough coins, your balance is ${economy.balance}.`);
        }

        // Check if user is VIP
        const vipUser = await Vip.findOne({ userId: interaction.user.id });
        let winChance = 0.5;
        if (vipUser) {
            winChance = 0.9;
        }

        // Deduct the bet from the user's balance
        economy.balance -= bet;
        await economy.save();

        // Generate a random number between 0 and 1 to determine if the user won
        const didWin = Math.random() <= winChance;

        // Generate a random number between 0 and 2 to determine the winning color
        const winningColorIndex = Math.floor(Math.random() * 3);
        const winningColor = colors[winningColorIndex];

        // Create the initial roulette message with the user's bet and color
        let rouletteEmbed = new MessageEmbed()
            .setTitle('Roulette')
            .setDescription(`${interaction.user.username} bet ${bet} coins on ${color}.\n\nSpinning the wheel...`)
            .setFooter('Results will be announced in 30 seconds.');

        // Validate the color and set the color of the embed
        if (color === 'red') {
            rouletteEmbed.setColor('#FF0000');
        } else if (color === 'green') {
            rouletteEmbed.setColor('#00FF00');
        } else if (color === 'yellow') {
            rouletteEmbed.setColor('#FFFF00');
        }

        const rouletteMessage = await interaction.reply({ embeds: [rouletteEmbed], fetchReply: true });

        // Wait 30 seconds
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Add the final result to the roulette message and update the user's balance
        if (didWin && color === winningColor) {
            const winnings = Math.floor(bet * 2);
            economy.balance += winnings;
            await economy.save();
            rouletteEmbed.setDescription(`${interaction.user.username} bet ${bet} coins on ${color} and won ${winnings} coins!\n\nThe winning color was ${winningColor}.`);
            rouletteEmbed.setFooter(`Your balance is now ${economy.balance} coins.`);

            // Check if user is VIP and add VIP bonus to the embed
            if (vipUser) {
                const vipBonus = Math.floor(winnings * 0.1);
                economy.balance += vipBonus;
                await economy.save();

                rouletteEmbed.addField('VIP Bonus', `You received a VIP bonus of ${vipBonus} coins!`);
                rouletteEmbed.setFooter(`Your balance is now ${economy.balance} coins (including VIP bonus).`);
            }
        } else {
            rouletteEmbed.setDescription(`${interaction.user.username} bet ${bet} coins on ${color} and lost.\n\nThe winning color was ${winningColor}.`);
            rouletteEmbed.setFooter(`Your balance is now ${economy.balance} coins.`);
        }

        // Update the original message with the final result
        await rouletteMessage.edit({ embeds: [rouletteEmbed] });
    }
};