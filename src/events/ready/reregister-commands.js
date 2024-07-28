// File path: src/events/ready/reregister-commands.js

const { Routes } = require('discord.js');

module.exports = (client, c, handler) => {
  const globalCommands = handler.commands
    .filter(
      (command) =>
        (command.data.integration_types?.length ||
          command.data.contexts?.length) &&
        !command.options?.devOnly
    )
    .map((command) => command.data);

  const devOnlyCommands = handler.commands
    .filter(
      (command) =>
        (command.data.integration_types?.length ||
          command.data.contexts?.length) &&
        command.options?.devOnly
    )
    .map((command) => command.data);

  client.rest
    .put(Routes.applicationCommands(client.user.id), {
      body: globalCommands,
    })
    .then(() => {
      console.log('Global commands re-registered');
    })
    .catch(console.error);

  const devGuildIds = handler.devGuildIds;

  devGuildIds.forEach((guildId) => {
    client.rest
      .put(Routes.applicationGuildCommands(client.user.id, guildId), {
        body: devOnlyCommands,
      })
      .then(() => {
        console.log(`Dev guild ${guildId} commands re-registered`);
      })
      .catch(console.error);
  });
};