module.exports = async (interaction, client) => {
  const { db } = require("../../lib/db");
  if (!interaction.isButton()) return;
  if (!interaction.message.embeds[0] || !interaction.message.embeds[0].footer) {
    
    return;
  }
  if (interaction.customId == "contact") {
  const userId = interaction.message.embeds[0].footer.text
    .split("|")
    .slice(1)
    .toString()
    .slice(1);
  const userInDB = await db.users.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!userInDB) {
    await interaction.reply({
      content: `The User you are looking for is not in the Database \n\n The user has to interact with the bot first to be in the Database`,
      ephemeral: true,
    });
    return;
  }
  const username = userInDB.username;

    const interactionUserDB = await db.users.findFirst({
      where: {
        userId: interaction.user.id,
      },
    });
    const Iclass = interactionUserDB.rssclass;
    //mach ich dabeim muss mir überlegen, wie ich das mache
    await interaction.reply({
      content: `__**Contact:**__\n**Ping:** <@${userId}>\n**Username:** ${username}\n**User ID:** ${userId}`,
      ephemeral: true,
    });
  } else if (buttonInteraction.customId === 'delete_scrims') {
      if (buttonInteraction.user.id !== interaction.user.id) {
        return buttonInteraction.reply({ content: 'You cannot delete someone else\'s scrims!', ephemeral: true });
      }
      let userInDB = await db.users.findUnique({
        where: {
            userId: interaction.user.id,
        },
        include: {
            messages: true,
        },
    });
    if (!userInDB || !userInDB.messages || userInDB.messages.length === 0) {
      await interaction.reply('No active searches');
  } else {
      // Delete all scrims of the user
      const reply = await interaction.reply('Closing search...', { fetchReply: true , ephemeral: true});

      // Edit every message in the chosen message
      for (let i = 0; i < searchMessage.messageIds.length; i++) {
          // Fetch the guild, channel, and message from Discord
          const guildId = searchMessage.guildIds[i];
          const channelId = searchMessage.channelIds[i];
          console.log(`Fetching channel ${channelId} from guild ${guildId}`);
          const guild = await client.guilds.fetch(guildId);
          if (!guild) {
              console.error(`Guild ${guildId} not found`);
              continue;
          }
          const channel = await client.channels.fetch(channelId);
          if (!channel) {
              console.error(`Channel ${channelId} not found`);
              continue;
          }
          let discordMessage;
      try {
          discordMessage = await channel.messages.fetch(searchMessage.messageIds[i]);
      } catch (error) {
          console.error(`Message ${searchMessage.messageIds[i]} not found`);
          continue;
      }
          // Edit the message in Discord
          const embed = new EmbedBuilder()
          .setAuthor({
              name: `${interaction.user.displayName} is LFS`,
              iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
              url: `https://discordapp.com/users/${interaction.user.id}/`,
            })
            .setDescription(
              `~~${searchMessage.content}~~`
            )
            .setColor("#ff7700")
            .setFooter({
              text: `Scrimfinder.de  | ${interaction.user.id}`,
              iconURL: "https://maierfabian.de/images/happypingu.png",
            })
            .setTimestamp();
            const row = new ActionRowBuilder()
              .addComponents(
                  new ButtonBuilder()
                      .setCustomId('findscrim')
                      .setLabel('This search is closed use /findscrim to find a new one.')
                      .setStyle('Danger')
                      .setDisabled(true),
              );
          await discordMessage.edit({ embeds: [embed] , components: [row] });
      }
      
      // Update the message in the database
      await db.message.delete({
          where: {
              id: searchMessage.id,
          },
      });
  
      await buttonInteraction.reply({ content: 'All your scrims have been deleted!', ephemeral: true });
    }
  } }
