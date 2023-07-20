const { MessageEmbed } = require('discord.js');
const { Vip } = require('../../models/VIPS');
const { Economy } = require('../../models/Economy');
const betaTestersID = require("../../json/config.json").betaTestersID;

// Map to keep track of command cooldowns
const cooldowns = new Map();

module.exports = {
    data: {
        name: 'vip',
        description: 'Allows users to buy VIP status and access exclusive features',
        options: [{
            name: 'action',
            description: 'Action to perform (buy/features/reward)',
            type: 'STRING',
            choices: [
                { name: 'Buy VIP', value: 'buy' },
                { name: 'View VIP features', value: 'features' },
                { name: 'Claim VIP reward', value: 'reward' },
            ],
            required: true,
        }],
    },
    async execute(interaction) {
        const vipCost = 15000000;

        const userVip = await Vip.findOne({ userId: interaction.user.id });
        const userBalance = await Economy.findOne({ userId: interaction.user.id });

        // Get the action from the interaction
        const action = interaction.options.getString('action');

        // Check if the user has enough balance to buy VIP
        if (action === 'buy') {
            if (!userBalance || userBalance.balance < vipCost) {
                return interaction.reply('You do not have enough balance to buy VIP!');
            }

            // Check if the user already has VIP status
            if (userVip && userVip.isVip) {
                return interaction.reply('You are already a VIP!');
            }

            const vipExpiration = new Date();
            vipExpiration.setDate(vipExpiration.getDate() + 30);

            if (userVip) {
                userVip.isVip = true;
                userVip.vipExpiration = vipExpiration;
                await userVip.save();
            } else {
                const newVip = new Vip({
                    userId: interaction.user.id,
                    isVip: true,
                    vipExpiration: vipExpiration,
                });
                await newVip.save();
            }

            const newBalance = userBalance.balance - vipCost;
            await Economy.findOneAndUpdate({ userId: interaction.user.id }, { balance: newBalance });

            return interaction.reply('You are now a VIP!');
        }

        // Check if the user is a VIP and can use VIP features
        if (action === 'features') {
            if (!userVip || !userVip.isVip) {
                return interaction.reply('You are not a VIP!');
            }

            const embed = new MessageEmbed()
                .setTitle('VIP features')
                .setColor('#00FF00')
                .setDescription('100x more earnings from work, daily and weekly rewards, 99% win on the roulette game\n+500000 currency every day with `/vip Claim VIP reward` command');
            return interaction.reply({ embeds: [embed] });
        }

        // Check if the user is a VIP and can claim the reward
        if (action === 'reward') {
            if (!userVip || !userVip.isVip) {
                return interaction.reply('You are not a VIP!');
            }

            // Check if the command is on cooldown
            const cooldownTime = 86400000; // 24 hours cooldown
            if (cooldowns.has(interaction.user.id)) {
                const expirationTime = cooldowns.get(interaction.user.id) + cooldownTime;
                const remainingTime = expirationTime - Date.now();
                const hours = Math.floor(remainingTime / 3600000);
                const minutes = Math.floor((remainingTime % 3600000) / 60000);
                const seconds = Math.floor(((remainingTime % 3600000) % 60000) / 1000);
                return interaction.reply(`You have already claimed your VIP reward. Please wait ${hours}h ${minutes}m ${seconds}s.`);
            }

            const rewardAmount = 500000;
            const newBalance = userBalance.balance + rewardAmount;
            await Economy.findOneAndUpdate({ userId: interaction.user.id }, { balance: newBalance });

            // Set cooldown for the user
            cooldowns.set(interaction.user.id, Date.now());

            return interaction.reply(`You claimed ${rewardAmount} currency as your VIP reward!`);
        }
    },
};