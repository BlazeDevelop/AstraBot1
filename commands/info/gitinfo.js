const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gitinfo')
        .setDescription('Получить информацию о пользователе или репозитории на GitHub')
        .addStringOption(option =>
            option.setName('query')
            .setDescription('Введите имя пользователя или название репозитория')
            .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const url = `https://api.github.com/${/\//.test(query) ? 'repos' : 'users'}/${query}`;

        try {
            const response = await fetch(url);
            const json = await response.json();
            const embed = {
                title: json.name || json.login,
                url: json.html_url,
                description: json.description || 'Нет описания.',
                thumbnail: {
                    url: json.avatar_url,
                },
                fields: [{
                        name: 'Подписчики',
                        value: json.followers.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: 'Подписки',
                        value: json.following.toLocaleString(),
                        inline: true,
                    },
                    {
                        name: 'Репозитории',
                        value: json.public_repos.toLocaleString(),
                        inline: true,
                    },
                ],
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Произошла ошибка при получении информации.');
        }
    },
};