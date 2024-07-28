const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../lib/db");
const { BANNED_USER_MESSAGE } = require("../../constants/banned");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("searchdraft")
        .setDescription("Search with a draft.")
        .addStringOption(option =>
            option
                .setName("draft")
                .setDescription("Choose wich draft you want to use")
                .addChoices({ name: "1", value: "1" })
                .addChoices({ name: "2", value: "2" })
                .addChoices({ name: "3", value: "3" })
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("The date of your Scrim")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("extrainfo")
                .setDescription("Add extra information to your draft")
        )
        .addStringOption((option) =>
            option
              .setName("shareit-everywhere")
              .addChoices({ name: "Yes", value: "yes" })
              .addChoices({ name: "no", value: "no" })
              .setDescription("Share the scrim in every channel you have access to.")
          )
          .setDMPermission(true),          run: async ({ interaction, client }) => {
            const sentMessageIds = [];
            const sentChannelIds = [];
            const sentGuildIds = [];
            let shareranges = interaction.options.getString("shareit-everywhere");
            const date = interaction.options.getString('date');
            const extraInfo = interaction.options.getString('extrainfo');
            const draftNumber = interaction.options.getString('draft');
            let time, maps;
            let userInDB = await getUserFromDB(interaction.user.id);
            const userBanned = await db.bannedUsers.findFirst({
              where: { userId: interaction.user.id },
            });
      
            
            if (!userInDB) {
                await interaction.reply({content:'You are not yet registered on the bot. Search at least one Scrim to create drafts', ephemeral: true});
            } else {
                const rank = userInDB.rssclass;
                await interaction.reply({ content: 'Building your Scrimsearch', ephemeral: true });
                const draftIndex = parseInt(draftNumber) - 1;
                if (userInDB.drafts[draftIndex]) {
                    const draft = userInDB.drafts[draftIndex].draft;
                    time = draft.time;
                    maps = draft.maps;
                } else {
                    await interaction.reply({content: '404 Draft not found...', ephemeral: true});
                }
            }
            try {
                await checkUserBanStatus(interaction);
            } catch (err) {
                console.log(err);
            }
            // Send the draft to all channels set for the user's current class
            await interaction.editReply({ content: 'Sending your Scrimsearch ... ' });
            
            const channels = await getChannelsForScrim(userInDB.rssclass);
            channels.forEach(async (channelId) => {
                const embed = constructScrimsearchEmbed(
                    interaction.user, 
                    date,
                    time, 
                    maps, 
                    extraInfo, 
                    userInDB.rssclass
                );
                const components = constructContactRow(interaction.user);
                await sendMessageToChannel(client, channelId, embed, components);
                try {
                    if (message) {
                        sentMessageIds.push(message.id);
                        sentChannelIds.push(channelId);
        
                        // Fetch the channel to get the guild ID
                        const channel = await client.channels.fetch(channelId);
                        if (channel.guild) {
                            sentGuildIds.push(channel.guild.id);
                        }
                    }
                } catch (err) {
                    console.log(`Failed to save message from channel: ${channelId}. Error: ${err.message}`);
                }
            });
            try {
                await interaction.editReply({ content: 'Saving your Search for you!' });
                await saveSearchToDB(interaction, sentMessageIds, sentChannelIds, sentGuildIds);
            } catch (err) {
                console.log(err);
            }
            await interaction.editReply({ content: 'Scrimsearch successfully send have fun playing!' });
        },
        options: {
          devOnly: true, // ✅
        },
        integration_types: [
          1, // USER
          0, // GUILD
      ],
      contexts: [
        0, // GUILD
        1, // BOT_DM
        2, // PRIVATE_CHANNEL
      ],
    };
    
    // Helper functions
    
    function createStringOption(name, description, required = false, choices = []) {
        const option = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
            .setRequired(required);
        choices.forEach(choice => option.addChoice(choice, choice));
        return option;
    }
    
    async function getUserFromDB(userId) {
        return await db.users.findUnique({
            where: {
                userId: userId,
            },
            include: {
                drafts: {
                    include: {
                        draft: true
                    }
                },
            },
        });
    }
    
    async function checkUserBanStatus(interaction) {
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
    }
    
    async function saveSearchToDB(interaction, sentMessageIds, sentChannelIds, sentGuildIds) {
        return await db.message.create({
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
    }
    
// Helper functions

async function sendMessageToChannel(client, channelId, embed, components) {
    const channelToSend = client.channels.cache.get(channelId);
    if (channelToSend) {
      try {
        return await channelToSend.send({ embeds: [embed], components: [components] });
      } catch (err) {
        console.log(`Failed to send message to channel: ${channelId}. Error: ${err.message}`);
      }
    }else{
      console.log(`Channel ${channelId} not found`);
    
    }
  }
  
  async function getChannelsForScrim(rank) {
    
          const guilds = await db.guilds.findMany();
          const channels = [];
  
          guilds.forEach((guild) => {
            if (guild.rssGtoIid && (rank === "I" || rank === "H" || rank === "G")) {
              channels.push(...guild.rssGtoIid);
            } else if (
              guild.rssDtoFid &&
              rank !== "I" &&
              rank !== "H" &&
              rank !== "G"
            ) {
              channels.push(...guild.rssDtoFid);
            }
          });
          return channels;
  }
  
  async function getChannelsForSharedScrim(rank) {
          const guilds = await db.guilds.findMany();
          const channels = [];
  
          guilds.forEach((guild) => {
            if (rank === "I" || rank === "H" || rank === "G") {
              if (guild.rssGtoIid) {
                channels.push(...guild.rssGtoIid);
              }
              if (guild.rssDtoFid) {
                channels.push(...guild.rssDtoFid);
              }
            } else if (rank !== "I" && rank !== "H" && rank !== "G") {
              if (guild.rssGtoIid) {
                channels.push(...guild.rssGtoIid);
              }
            }
          });
          return channels;
  }
  
  
  function constructInviteButton() {
    const invitebtn = new ButtonBuilder()
      .setLabel("Invite Me")
      .setStyle(ButtonStyle.Link)
      .setURL("https://docs.scrimfinder.de/invite")
      .setEmoji("1173655743606567035");
  
    return new ActionRowBuilder().addComponents(invitebtn);
  }
  
  function constructContactRow(user) {
    const btn = new ButtonBuilder()
      .setLabel("📬Contact📬")
      .setCustomId("contact")
      .setStyle(ButtonStyle.Primary);
    const test = new ButtonBuilder()
      .setLabel("Direct Message")
      .setStyle(ButtonStyle.Link)
      .setURL(`discord://-/users/${user.id}`);
  
    return new ActionRowBuilder().addComponents(btn, test);
  }
  
  function constructScrimsearchEmbed(user, date, time, bestof, extrainfo, rank) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${user.displayName} is LFS`,
        iconURL: `http://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`,
        url: `https://discordapp.com/users/${user.id}/`,
      })
      .setDescription(` **${date} ${time}** |     **Class ${rank}** |     **${bestof} Maps**`)
      .setColor("#ff7700")
      .setFooter({
        text: `Scrimfinder.gg  | ${user.id}`,
        iconURL: "https://maierfabian.de/images/happypingu.png",
      })
      .setTimestamp();
  
    // Only add the 'Extra Informations' field if extrainfo is not null
    if (extrainfo) {
      embed.addFields({
        name: "Extra Informations",
        value: `${extrainfo}`,
        inline: false,
      });
    }
  
    return embed;
  }
  async function getChannelsForGSAScrim() {
    const guilds = await db.guilds.findMany();
    const channels = [];
  
    guilds.forEach((guild) => {
      if (guild.rssDtoFid) {
        channels.push(...guild.rssDtoFid);
      }
    });
  
    return channels;
  }