const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const config = require('./json/config.json');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

client.queue = new Map();
client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
}

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.error(err));

client.once('ready', async() => {
    console.log('Bot is ready!');
    client.user.setActivity('/help', { type: 'WATCHING' });

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./commands/${folder}/${file}`);
            client.commands.set(command.data.name, command);
            console.log(`Registered slash command "${command.data.name}"`);
        }
    }
});

client.on('interactionCreate', async(interaction) => {
    if (!interaction.guild) {
        return interaction.reply({
            content: 'Команды нельзя использовать в личных сообщениях!',
            ephemeral: true,
        });
    }

    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const errorEmbed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Error')
            .setDescription('There was an error while executing this command!')
            .addField('Error Message', error.message)
            .setTimestamp();
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
});

client.login(config.token);