const Discord = require("discord.js");

module.exports = async(client) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    const activeUserRoleId = "1072077543684964352";
    const activeUserChannelId = "1069902713099395112";

    const guild = client.guilds.cache.get("1069898192478552134");
    const activeUserChannel = guild.channels.cache.get(activeUserChannelId);
    const activeUserRole = guild.roles.cache.get(activeUserRoleId);

    let activeUser;

    // Find the most active user of the current month
    const members = guild.members.cache.array();
    let maxMessages = 0;
    for (const member of members) {
        const messages = await member.user.fetchMessages({ limit: 100 });
        let messagesInCurrentMonth = 0;
        for (const message of messages.array()) {
            if (message.createdAt.getMonth() === currentMonth) {
                messagesInCurrentMonth++;
            }
        }
        if (messagesInCurrentMonth > maxMessages) {
            maxMessages = messagesInCurrentMonth;
            activeUser = member;
        }
    }

    // Send the active user embed in the active user channel
    const embed = new Discord.MessageEmbed()
        .setTitle("Active User of the Month!")
        .setDescription(`The most active user this month is ${activeUser}. They receive the role of the most active!`)
        .setThumbnail(activeUser.user.displayAvatarURL());
    activeUserChannel.send(embed);

    // Give the active user the active user role
    activeUser.roles.add(activeUserRole);
};