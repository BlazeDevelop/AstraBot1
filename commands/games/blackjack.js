const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Economy } = require('../../models/Economy');

async function getHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    for (const card of hand) {
        if (card === 'A') {
            value += 11;
            aceCount++;
        } else if (card === 'K' || card === 'Q' || card === 'J') {
            value += 10;
        } else {
            value += parseInt(card);
        }
    }

    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }

    return value;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of Blackjack')
        .addIntegerOption(option => option.setName('bet').setDescription('Your bet amount').setRequired(true)),

    async execute(interaction) {
        const betAmount = interaction.options.getInteger('bet');

        if (betAmount <= 0) {
            return interaction.reply('Invalid bet amount. Please enter a positive value.');
        }

        const user = interaction.user;

        let userData = await Economy.findOne({ userID: user.id });

        if (!userData) {
            userData = new Economy({
                userID: user.id,
                balance: 100
            });

            await userData.save();
        }

        if (userData.balance < betAmount) {
            return interaction.reply('You do not have enough balance to place this bet.');
        }

        const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const dealerHand = [cards[Math.floor(Math.random() * cards.length)]];
        const playerHand = [cards[Math.floor(Math.random() * cards.length)], cards[Math.floor(Math.random() * cards.length)]];

        let dealerHandValue = await getHandValue(dealerHand);
        let playerHandValue = await getHandValue(playerHand);

        const dealerCardsString = `**Dealer's Hand:** ${dealerHand[0]} ?`;
        const playerCardsString = `**Your Hand:** ${playerHand.join(', ')}`;

        const embed = new MessageEmbed()
            .setColor('#FFFFFF')
            .setTitle('Blackjack')
            .setDescription(`${dealerCardsString}\n${playerCardsString}`)
            .addField('Your Bet', `${betAmount} coins`)
            .addField('Your Balance', `${userData.balance} coins`);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('hit')
                .setLabel('Hit')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('stand')
                .setLabel('Stand')
                .setStyle('PRIMARY')
            );

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === interaction.user.id && (i.customId === 'hit' || i.customId === 'stand');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'hit') {
                const newCard = cards[Math.floor(Math.random() * cards.length)];
                playerHand.push(newCard);
                const newPlayerHandValue = await getHandValue(playerHand);

                if (newPlayerHandValue === 21) {
                    collector.stop('blackjack');
                } else if (newPlayerHandValue > 21) {
                    collector.stop('bust');
                } else {
                    const newPlayerCardsString = `**Your Hand:** ${playerHand.join(', ')}`;
                    embed.setDescription(`${dealerCardsString}\n${newPlayerCardsString}`);
                    await i.update({ embeds: [embed] });
                }
            } else if (i.customId === 'stand') {
                collector.stop('stand');
            }
        });

        collector.on('end', async(_, reason) => {
            if (reason === 'time') {
                return interaction.editReply('Blackjack game timed out. Please try again.');
            }

            if (reason === 'blackjack') {
                const dealerSecondCard = cards[Math.floor(Math.random() * cards.length)];
                dealerHand.push(dealerSecondCard);

                while (dealerHandValue < 17) {
                    const newDealerCard = cards[Math.floor(Math.random() * cards.length)];
                    dealerHand.push(newDealerCard);
                    dealerHandValue = await getHandValue(dealerHand);
                }

                const dealerCardsString = `**Dealer's Hand:** ${dealerHand.join(', ')}`;

                embed.setDescription(`${dealerCardsString}\n${playerCardsString}`);

                if (dealerHandValue === 21) {
                    embed.addField('Result', 'Dealer has Blackjack. You lose.');
                    userData.balance -= betAmount;
                } else if (dealerHandValue > 21) {
                    embed.addField('Result', 'Dealer busts. You win!');
                    userData.balance += betAmount;
                } else if (dealerHandValue === playerHandValue) {
                    embed.addField('Result', "It's a tie.");
                } else if (dealerHandValue > playerHandValue) {
                    embed.addField('Result', 'Dealer wins. You lose.');
                    userData.balance -= betAmount;
                } else {
                    embed.addField('Result', 'You win!');
                    userData.balance += betAmount;
                }

                await Economy.findOneAndUpdate({ userID: user.id }, { balance: userData.balance });
                await interaction.editReply({ embeds: [embed], components: [] });
            } else if (reason === 'bust') {
                const dealerCardsString = `**Dealer's Hand:** ${dealerHand.join(', ')}`;

                embed.setDescription(`${dealerCardsString}\n${playerCardsString}`);
                embed.addField('Result', 'You bust. You lose.');
                userData.balance -= betAmount;
                await Economy.findOneAndUpdate({ userID: user.id }, { balance: userData.balance });
                await interaction.editReply({ embeds: [embed], components: [] });
            }
        });
    },
};