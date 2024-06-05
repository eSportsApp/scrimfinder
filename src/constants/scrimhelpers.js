const {SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,} = require("discord.js");
const { db } = require("../lib/db");
const { BANNED_USER_MESSAGE } = require("../constants/banned");
const redis = require("../lib/redis");

async function sendMessageToChannel(client, channelId, embed, components) {
    const channelToSend = client.channels.cache.get(channelId);
    if (channelToSend) {
      try {
        return await channelToSend.send({
          embeds: [embed],
          components: [components],
        });
      } catch (err) {
        console.log(
          `Failed to send message to channel: ${channelId}. Error: ${err.message}`
        );
        await removeChannelIfNotFoundOrNoAccess(client, channelId);
      }
    } else {
      console.log(`Channel ${channelId} not found`);
      await removeChannelIfNotFoundOrNoAccess(client, channelId);
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
      .setDescription(
        ` **${date} ${time}** |     **Class ${rank}** |     **${bestof} Maps**`
      )
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

  //todo: fix it so it works
  async function removeChannelIfNotFoundOrNoAccess(client, channelId) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      try {
        const guildsToUpdate = await db.guilds.findMany({
          where: {
            OR: [
              { rssGtoIid: { has: channelId } },
              { rssDtoFid: { has: channelId } },
            ],
          },
        });
  
        for (const guild of guildsToUpdate) {
          if (guild.rssGtoIid.includes(channelId)) {
            const updatedArray = guild.rssGtoIid.filter(id => id !== channelId);
            await db.guilds.update({
              where: { id: guild.id },
              data: { rssGtoIid: { set: updatedArray } },
            });
          }
  
          if (guild.rssDtoFid.includes(channelId)) {
            const updatedArray = guild.rssDtoFid.filter(id => id !== channelId);
            await db.guilds.update({
              where: { id: guild.id },
              data: { rssDtoFid: { set: updatedArray } },
            });
          }
        }
  
        console.log(`Channel ${channelId} was removed from the database.`);
      } catch (err) {
        console.log(`Failed to remove channel ${channelId} from the database. Error: ${err.message}`);
      }
    }
  }
module.exports = {
    sendMessageToChannel: sendMessageToChannel,
    getChannelsForScrim: getChannelsForScrim,
    getChannelsForSharedScrim: getChannelsForSharedScrim,
    constructInviteButton: constructInviteButton,
    constructContactRow: constructContactRow,
    constructScrimsearchEmbed: constructScrimsearchEmbed,
    getChannelsForGSAScrim: getChannelsForGSAScrim,
};  

