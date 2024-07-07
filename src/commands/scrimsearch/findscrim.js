const {SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,} = require("discord.js");
const { db } = require("../../lib/db");
const { BANNED_USER_MESSAGE } = require("../../constants/banned");
const {sendMessageToChannel, getChannelsForScrim, getChannelsForSharedScrim, constructInviteButton, constructContactRow, constructScrimsearchEmbed, getChannelsForGSAScrim} = require('../../constants/scrimhelpers');
module.exports = {
  run: async ({ client, interaction }) => {
    const game = interaction.options.getString("game");
    const date = interaction.options.getString("date");
    const time = interaction.options.getString("time");
    const bestof = interaction.options.getString("best-of");
    let teamname = interaction.options.getString("team-name");
    let extrainfo = interaction.options.getString("extra-info");
    let shareranges = interaction.options.getString("shareit-everywhere");
    let rank;
    const sentMessageIds = [];
    const sentChannelIds = [];
    const sentGuildIds = [];

    try {
      maps = parseInt(interaction.options.getString("best-of"));
    } catch (err) {
      console.log(err);
    }

    try {
      const userBanned = await db.bannedUsers.findFirst({
        where: { userId: interaction.user.id },
      });

      if (userBanned) {
        await interaction.reply({
          embeds: [BANNED_USER_MESSAGE],
          ephemeral: true,
        });
        return;
      }

      let userInDB = await db.users.findFirst({
        where: { userId: interaction.user.id },
      });

      if (!userInDB) {
        userInDB = await db.users.create({
          data: {
            userId: interaction.user.id,
            username: interaction.user.username,
            rssclass: "I",
          },
        });
        rank = "I";
        const welcome = new EmbedBuilder()
          .setTitle("Welcome to Scrimfinder!")
          .setDescription(
            "Welcome in the Scrimfinder Family! \n\nYou can now start finding scrims with the command /findscrim\n\nIf you have any questions feel free to ask in our [Discord](https://discord.gg/nrbwf929rK) or visit our [Website](https://scrimfinder.gg)"
          )
          .addFields({
            name: "What are Classes?",
            value:
              "Scrimfinder uses Classes to determine the skill level of the players. \n\n**Class I** is the lowest class and **Class A** is the highest class. \n\nYour class gets determined by your teams achivements in leagues and tournaments. Check out our discord for more information.",
            inline: true,
          })
          .setColor("#ff7700")
          .setThumbnail("https://maierfabian.de/images/hipingu.png")
          .setFooter({
            text: "scrimfinder.gg | Finding Scrims was never that easy",
            iconURL: "https://maierfabian.de/images/lovepingu.png",
          });
        try {
          await interaction.user.send({ embeds: [welcome] });
        } catch (err) {
          console.log(
            `Failed to send DM to user: ${interaction.user.id}. Error: ${err.message}`
          );
        }
      } else {
        rank = userInDB.rssclass;
        if (userInDB.username !== interaction.user.username) {
          await db.users.update({
            where: { userId: interaction.user.id },
            data: { username: interaction.user.username },
          });
        }
      }
    } catch (err) {
      console.log(err);
      return;
    }
    try {
      await interaction.deferReply({ ephemeral: true });
      const send = new EmbedBuilder()
        .setTitle("Scrimsearch started!")
        .setURL("https://docs.scrimfinder/invite")
        .setDescription(
          "Have fun and make sure that your DM's are open.\nIf you haven't already consider to invite me to your Server!"
        )
        .setColor("#ff7700")
        .setFooter({
          text: "scrimfinder.gg | Finding Scrims was never that easy",
          iconURL: "https://maierfabian.de/images/lovepingu.png",
        })
        .setTimestamp();

      const inv = constructInviteButton();

      if (!teamname) {
        teamname = "";
      }

      const contactRow = constructContactRow(interaction.user);
      if (extrainfo === null) {
        extrainfo = "";
      }
      try {
        if (game === "rss") {
          if (rank === "I" || rank === "H" || rank === "G") {
            const channels = await getChannelsForScrim(rank);

            if (channels.length) {
              const scrimsearchEmbed = constructScrimsearchEmbed(
                interaction.user,
                date,
                time,
                bestof,
                extrainfo,
                rank
              );
              //! rn search has to be implemented in scrimhelpers.js
              if (date.toLowerCase() === "today" || date.toLowerCase() === "rn" || date.toLowerCase() === "now") {
                const channelId = '719933814054584391'; // replace with your channel ID
                const guildId = '637333042301632535'; // replace with your guild ID
                const specificChannel = await client.channels.fetch(channelId);
                console.log(`Found channel: ${specificChannel.name}`);
                rnscrim = new EmbedBuilder()
                .setAuthor({
                  name: `${interaction.user.displayName} is LFS`,
                  iconURL: `http://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`,
                  url: `https://discordapp.com/users/${interaction.user.id}/`,
                })
                .setDescription(
                  ` **${time}** |     **Class ${rank}** |     **${bestof} Maps**`
                )
                .setColor("#ff7700")
                .setFooter({
                  text: `Scrimfinder.gg  | ${interaction.user.id}`,
                  iconURL: "https://maierfabian.de/images/happypingu.png",
                })
                .setTimestamp();
            
              // Only add the 'Extra Informations' field if extrainfo is not null
              if (extrainfo) {
                rnscrim.addFields({
                  name: "Extra Informations",
                  value: `${extrainfo}`,
                  inline: false,
                });
              }
                try{
                  if (specificChannel.guild.id === guildId) { // check if the channel is in the specific guild
                  const message = await specificChannel.send({embeds: [rnscrim],
                    components: [contactRow], }); // replace with your message
                  sentMessageIds.push(message.id);
                  sentChannelIds.push(channelId);
                  sentGuildIds.push(guildId);
                  console.log(`Sent message rn to channel: ${channelId}`);
                }
              }catch(err){
                  console.log(err);
                }
              }
              //*end of rn search
              for (const c of channels) {
                const message = await sendMessageToChannel(
                  client,
                  c,
                  scrimsearchEmbed,
                  contactRow
                );
                if (message) {
                  sentMessageIds.push(message.id);
                  sentChannelIds.push(c);
                  if (interaction.guild) {
                    sentGuildIds.push(interaction.guild.id);
                  }
                }
              }
            }
          } else {
            const channels = await getChannelsForGSAScrim();

            if (channels.length) {
              const scrimsearchEmbed = constructScrimsearchEmbed(interaction.user, date, time, bestof, extrainfo, rank);

              for (const c of channels) {
                const message = await sendMessageToChannel(client, c, scrimsearchEmbed, contactRow);
                if (message) {
                  sentMessageIds.push(message.id);
                  sentChannelIds.push(c);
                  if (interaction.guild) {
                    sentGuildIds.push(interaction.guild.id);
                  }
                }
              }
            }
          }

          if (shareranges === "yes") {
            if (rank === "I" || rank === "H" || rank === "G") {

            }else{
            const channels = await getChannelsForSharedScrim(rank);
            
            if (channels.length) {
              const scrimsearchEmbed = constructScrimsearchEmbed(
                interaction.user,
                date,
                time,
                bestof,
                extrainfo,
                rank
              );
              
              for (const c of channels) {
                try {
                  const message = await sendMessageToChannel(client, c, scrimsearchEmbed, contactRow);
                  if (message) {
                    sentMessageIds.push(message.id);
                    sentChannelIds.push(c);
                    if (interaction.guild) { // Check if interaction.guild exists before accessing its id
                      sentGuildIds.push(interaction.guild.id);
                    }
                  }
                } catch (err) {
                  console.log(`Failed to send message to channel: ${c}. Error: ${err.message}`);
                }
              }
            }
            }
          }
        }
      } catch (err) {
        console.log(err);
        return;
      }

      try {
        await db.message.create({
          data: {
            content: ` **${date} ${time} **     **Class ${rank}**     **${bestof} Maps**`,
            messageIds: sentMessageIds,
            channelIds: sentChannelIds,
            guildIds: sentGuildIds,
            user: {
              connect: {
                userId: interaction.user.id,
              },
            },
          },
        });


    
        await interaction.editReply({
          embeds: [send],
          components: [inv],
          ephemeral: true,
        });
      } catch (err) {
        console.log(err);
        await interaction.editReply({ embeds: [send], components: [inv] });
      }
    } catch (err) {
      console.log(err);
    }
  },

  data: new SlashCommandBuilder()
    .setName("findscrim")
    .setDescription("Find a scrim. Your class will automaticly get set")
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("The game you want to find a scrim for.")
        .addChoices({ name: "Rainbow Six Siege", value: "rss" })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("best-of").setDescription("Best of.").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("The date you want to find a scrim for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time you want to scrim.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("extra-info")
        .setDescription("Extra information about the scrim.")
    )
    .addStringOption((option) =>
      option
        .setName("shareit-everywhere")
        .addChoices({ name: "Yes", value: "yes" })
        .addChoices({ name: "no", value: "no" })
        .setDescription("Share the scrim in every channel you have access to.")
    )
    .setDMPermission(false),
};