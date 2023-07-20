const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildMemberRemove',

    /**
     * @param {GuildMember} member 
     * @param {Client} client 
     */


    once: false,
    execute(member) {
        // Отправляем сообщение в канал
        const welcomeChannel = member.guild.channels.cache.get('1089585113152618516');
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Прощай, ${member.username}!`)
            .setDescription('Будем по тебе скучать.')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
        welcomeChannel.send({ embeds: [embed] });
    },
};