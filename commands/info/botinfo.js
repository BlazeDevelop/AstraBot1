const { MessageEmbed } = require('discord.js');
const Update = require('../../models/Updates')

module.exports = {
    data: {
        name: 'botinfo',
        description: 'Displays information about the bot.',
    },
    async execute(interaction) {
        const update = await Update.findOne().sort('-date'); // Получаем последнее обновление из базы данных
        const client = interaction.client;
        const botEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("AstraBot")
            .setDescription("As a bot, I was designed and programmed to assist individuals in various tasks such as entertainment, moderation and other functions that can make their experience more enjoyable and convenient. My purpose is to be of service and to simplify tasks so that my users can have a stress-free and fulfilling experience.")
            .addField("Prefix", "/", true)
            .addField("Command for more information", "/help", true)
            .addField("Build", `${update.number} ALPHA (${update.date.toLocaleDateString()})`, true) // Используем свойства объекта update
            .addField("Developers", "@blazeyt#3344 \n@vseyard#8490", true)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter("© 2023 All rights reserved");

        await interaction.reply({ embeds: [botEmbed] });
    },
};