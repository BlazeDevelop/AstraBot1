const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolemenu')
    .setDescription('Creates or manages a role menu')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Creates a role menu')
        .addStringOption(option =>
          option.setName('text')
            .setDescription('Text for the role menu message')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Adds a role to the role menu')
        .addStringOption(option =>
          option.setName('id')
            .setDescription('ID of the role menu message')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to be added to the role menu')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Removes a role from the role menu')
        .addStringOption(option =>
          option.setName('id')
            .setDescription('ID of the role menu message')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to be removed from the role menu')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
      const text = interaction.options.getString('text');

      // Check if user has permission to manage roles
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        return interaction.reply('You do not have permission to manage roles.');
      }

      const roleMenuEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Role Menu')
        .setDescription(text);

      const roleMenuMessage = await interaction.channel.send({ embeds: [roleMenuEmbed] });
      // Save the role menu message ID in your preferred way (e.g., database) for future reference
      const roleMenuMessageID = roleMenuMessage.id;

      return interaction.reply('Role menu created successfully.');
    }

    if (subcommand === 'add') {
      const id = interaction.options.getString('id');
      const role = interaction.options.getRole('role');

      // Check if user has permission to manage roles
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        return interaction.reply('You do not have permission to manage roles.');
      }

      try {
        const roleMenuMessage = await interaction.channel.messages.fetch(id);

        // Check if the message is a role menu message
        if (!roleMenuMessage.embeds[0] || roleMenuMessage.embeds[0].title !== 'Role Menu') {
          return interaction.reply('The specified message is not a role menu message.');
        }

        // Add the role to the role menu
        roleMenuMessage.react(role);

        return interaction.reply(`Role '${role.name}' added to the role menu.`);
      } catch (error) {
        console.error(error);
        return interaction.reply('An error occurred while adding the role to the role menu.');
      }
    }

    if (subcommand === 'remove') {
      const id = interaction.options.getString('id');
      const role = interaction.options.getRole('role');

      // Check if user has permission to manage roles
      if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
        return interaction.reply('You do not have permission to manage roles.');
      }

      try {
        const roleMenuMessage = await interaction.channel.messages.fetch(id);

        // Check if the message is a role menu message
        if (!roleMenuMessage.embeds[0] || roleMenuMessage.embeds[0].title !== 'Role Menu') {
          return interaction.reply('The specified message is not a role menu message.');
        }

        // Remove the role from the role menu
        roleMenuMessage.reactions.cache.get(role.id)?.remove();

        return interaction.reply(`Role '${role.name}' removed from the role menu.`);
      } catch (error) {
        console.error(error);
        return interaction.reply('An error occurred while removing the role from the role menu.');
      }
    }
  },
};