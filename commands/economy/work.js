const { MessageEmbed } = require('discord.js');
const { Economy } = require('../../models/Economy');
const { Inventory } = require('../../models/Inventory');
const { Vip } = require('../../models/VIPS');

module.exports = {
    data: {
        name: 'work',
        description: 'Work to earn some coins!',
    },
    async execute(interaction) {
        let jobs = [
            { name: 'Software Developer', pay: 150 },
            { name: 'Web Designer', pay: 125 },
            { name: 'Data Analyst', pay: 200 },
            { name: 'Cybersecurity Specialist', pay: 250 },
            { name: 'DevOps Engineer', pay: 175 },
            { name: 'Artificial Intelligence Engineer', pay: 300 },
            { name: 'Machine Learning Engineer', pay: 250 },
            { name: 'Full-Stack Developer', pay: 200 },
            { name: 'Mobile App Developer', pay: 150 },
            { name: 'Systems Administrator', pay: 175 }
        ];

        let randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        let job = randomJob.name;
        let pay = randomJob.pay;
        const user = await Economy.findOne({ userID: interaction.user.id });
        const inventory = await Inventory.findOne({ userId: interaction.user.id });
        const vipUser = await Vip.findOne({ userId: interaction.user.id });

        if (vipUser) {
            pay *= 100; // Увеличиваем заработную плату в 100 раз для VIP-аккаунтов
        }

        if (user) {
            let timePassed = Date.now() - user.lastWork;
            let timeLeft = 2 * 60 * 60 * 1000 - timePassed;

            if (timePassed < 2 * 60 * 60 * 1000) {
                const embed = new MessageEmbed()
                    .setTitle('Work')
                    .setColor('#0099ff')
                    .setDescription(`Please wait ${Math.floor(timeLeft / (60 * 60 * 1000))} hours and ${Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000))} minutes before using this command again.`);

                return interaction.reply({ embeds: [embed] });
            }

            if (inventory && inventory.items.some(item => item.name === "Laptop")) {
                pay *= 3;
            }

            user.balance += pay;
            user.lastWork = Date.now();
            await user.save();

            const embed = new MessageEmbed()
                .setTitle('Work')
                .setColor('#0099ff')
                .addField('Job', job)
                .addField('Salary', pay + ' coins')
                .addField('Balance', user.balance + ' coins');

            return interaction.reply({ embeds: [embed] });
        } else {
            const newUser = new Economy({
                userID: interaction.user.id,
                balance: 100,
                lastWork: Date.now()
            });

            if (inventory && inventory.items.some(item => item.name === "Laptop")) {
                pay *= 3;
            }

            newUser.balance += pay;
            await newUser.save();

            const embed = new MessageEmbed()
                .setTitle('Work')
                .setColor('#0099ff')
                .addField('Job', job)
                .addField('Salary', pay + ' coins')
                .addField('Balance', newUser.balance + ' coins');

            return interaction.reply({ embeds: [embed] });
        }
    }
}