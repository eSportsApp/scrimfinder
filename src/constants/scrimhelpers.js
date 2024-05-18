const {SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,} = require("discord.js");
const { db } = require("../../lib/db");
const { BANNED_USER_MESSAGE } = require("../../constants/banned");
const redis = require("../../lib/redis");

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
      }
    } else {
      console.log(`Channel ${channelId} not found`);
    }
  }
  
  async function getChannelsForScrim(rank) {
    const key = `scrim:${rank}`;
  
    return new Promise((resolve, reject) => {
      redis.get(key, async (err, result) => {
        if (result) {
          resolve(JSON.parse(result));
        } else {
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
  
          // Setzen Sie den Schlüssel mit einem Ablaufzeitlimit von 60 Sekunden (1 Minute)
          redis.set(key, JSON.stringify(channels), 'EX', 60);
          resolve(channels);
        }
      });
    });
  }
  
  async function getChannelsForSharedScrim(rank) {
    const key = `sharedScrim:${rank}`;
  
    return new Promise((resolve, reject) => {
      redis.get(key, async (err, result) => {
        if (result) {
          resolve(JSON.parse(result));
        } else {
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
  
          // Setzen Sie den Schlüssel mit einem Ablaufzeitlimit von 60 Sekunden (1 Minute)
          redis.set(key, JSON.stringify(channels), 'EX', 60);
          resolve(channels);
        }
      });
    });
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
module.exports = {
    sendMessageToChannel: sendMessageToChannel,
    getChannelsForScrim: getChannelsForScrim,
    getChannelsForSharedScrim: getChannelsForSharedScrim,
    constructInviteButton: constructInviteButton,
    constructContactRow: constructContactRow,
    constructScrimsearchEmbed: constructScrimsearchEmbed,
    getChannelsForGSAScrim: getChannelsForGSAScrim,
};  

