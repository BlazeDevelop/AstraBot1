const { MessageEmbed, WebhookClient, GuildMember } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {
        const { user, guild } = member;

        member.roles.add("1090325270805880913")
        const Welcomer = new WebhookClient({
            id: "1090661225790177421",
            token: "GEuDY26xQ1FNt662IWBo9afog-Nn7hpAANt7dQ3k4bkUoIOpJlV3ieACYslbQJTnJHFC"
        })
        const Welcome = new MessageEmbed()
            .setColor('AQUA')
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`
            Добро пожаловать, ${member} на сервер **${guild.name}**!\n
            Аккаунт создан: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nКоличество участников: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Welcomer.send({ embeds: [Welcome] })
    }
}