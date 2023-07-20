const { MessageEmbed } = require('discord.js');
const Update = require('../../models/Updates');

module.exports = {
    data: {
        name: 'update',
        description: 'Добавление и просмотр обновлений бота',
        options: [{
                name: 'list',
                description: 'Список всех добавленных обновлений',
                type: 'SUB_COMMAND',
            },
            {
                name: 'add',
                description: 'Добавить новое обновление (только для владельца бота)',
                type: 'SUB_COMMAND',
                options: [{
                        name: 'number',
                        description: 'Номер сборки',
                        type: 'INTEGER',
                        required: true,
                    },
                    {
                        name: 'description',
                        description: 'Описание обновления',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'date',
                        description: 'Дата добавления',
                        type: 'STRING',
                        required: true,
                    },
                    {
                        name: 'additions',
                        description: 'Что добавлено',
                        type: 'STRING',
                        required: false,
                    },
                    {
                        name: 'removed',
                        description: 'Что удалено',
                        type: 'STRING',
                        required: false,
                    },
                ],
            },
        ],
    },
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'add') {
            // Проверяем, что команду выполняет владелец бота
            const { ownerID } = require('../../json/config.json');
            if (interaction.user.id !== ownerID) {
                return interaction.reply({
                    content: 'Вы не являетесь владельцем бота!',
                    ephemeral: true,
                });
            }

            // Извлекаем данные из опций
            const number = interaction.options.getInteger('number');
            const description = interaction.options.getString('description');
            const date = interaction.options.getString('date');
            const additions = interaction.options.getString('additions');
            const removed = interaction.options.getString('removed');

            // Создаем новый объект обновления и сохраняем его в базу данных
            const newUpdate = new Update({
                number,
                description,
                date: new Date(date),
                additions,
                removed,
            });
            await newUpdate.save();

            return interaction.reply({
                content: `Обновление №${number} было успешно добавлено!`,
                ephemeral: true,
            });
        } else if (interaction.options.getSubcommand() === 'list') {
            // Ищем все обновления в базе данных
            const updates = await Update.find().sort({ number: 'desc' }).exec();

            // Создаем эмбед со списком обновлений
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Список обновлений')
                .setTimestamp();
            // Добавляем каждое обновление в список
            updates.forEach((update) => {
                embed.addField(
                    `Обновление №${update.number} (${update.description})`,
                    `**Дата добавления:** ${update.date.toLocaleDateString()}\n` +
                    (update.additions ?
                        `**Добавлено:** ${update.additions}\n` :
                        '') +
                    (update.removed ? `**Удалено:** ${update.removed}` : ''),
                );
            });

            return interaction.reply({ embeds: [embed] });
        }
    },
};