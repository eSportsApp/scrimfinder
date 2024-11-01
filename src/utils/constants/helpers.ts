import {SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ButtonStyle,ActionRowBuilder,} from "discord.js";
import  db from"../db";
import {  Client, Colors, ComponentType, TextChannel } from 'discord.js'

async function sendMessageToChannel(client: any, channelId: any, embed: any, components: any) {
    const channelToSend = client.channels.cache.get(channelId);
    if (channelToSend) {
      try {
        return await channelToSend.send({
          embeds: [embed],
          components: [components],
        });
      } catch (err) {
        console.log(
          `Failed to send message to channel: ${channelId}. Error: ${(err as any).message}`
        );
        await removeChannelIfNotFoundOrNoAccess(client, channelId);
      }
    } else {
      console.log(`Channel ${channelId} not found`);
      await removeChannelIfNotFoundOrNoAccess(client, channelId);
    }
  }
  
  async function getChannelsForScrim(rank: string) {
    const guilds = await db.guilds.findMany();
    const channels: string[] = [];
  
    guilds.forEach((guild: any) => {
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
  
  async function getChannelsForSharedScrim(rank: string) {
    const guilds = await db.guilds.findMany();
    const channels: string[] = [];
  
    guilds.forEach((guild: any) => {
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
  
  
  
  function constructScrimsearchEmbed(user: any, date: string, time: string, bestof: string, extrainfo: string, rank: string) {
    const embed = {embeds: [
      {
        color: 16744192, //#ff7700
        author: {
          name: `${user.displayName} is LFS`,
          icon_url: user.avatar,
          url: `https://discordapp.com/users/${user.id}/`,
          },
        description: ` **${time}** |     **Class ${rank}** |     **${bestof} Maps**`,
        footer: {
            text: `scrimfinder.gg | ${user.id}`,
            icon_url: 'https://maierfabian.de/images/lovepingu.png',    
        },
      }
    ],
    components: [
        {
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.Button,
                    label: '📬Contact📬',
                    style: ButtonStyle.Primary,
                    customId: 'contact', 
                },
                {
                    type: ComponentType.Button,
                    label: 'Direct Message',
                    style: ButtonStyle.Link,
                    url: `discord://-/users/${user.id}`,
                }
            ]
        }
    ],}

  
    return embed;
  }
  async function getChannelsForGSAScrim() {
    const guilds = await db.guilds.findMany();
    const channels: any = [];
  
    guilds.forEach((guild: any) => {
      if (guild.rssDtoFid) {
        channels.push(...guild.rssDtoFid);
      }
    });
  
    return channels;
  }

  //todo: fix it so it works
  async function removeChannelIfNotFoundOrNoAccess(client: any, channelId: string) {
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
            const updatedArray = guild.rssGtoIid.filter((id: string) => id !== channelId);
            await db.guilds.update({
              where: { id: guild.id },
              data: { rssGtoIid: { set: updatedArray } },
            });
          }
  
          if (guild.rssDtoFid.includes(channelId)) {
            const updatedArray = guild.rssDtoFid.filter((id: string) => id !== channelId);
            await db.guilds.update({
              where: { id: guild.id },
              data: { rssDtoFid: { set: updatedArray } },
            });
          }
        }
  
        console.log(`Channel ${channelId} was removed from the database.`);
      } catch (err: any) {
        console.log(`Failed to remove channel ${channelId} from the database. Error: ${err.message}`);
      }
    }
  }
  export {
    sendMessageToChannel,
    getChannelsForScrim,
    getChannelsForSharedScrim,
    constructInviteButton,
    constructScrimsearchEmbed,
    getChannelsForGSAScrim,
};
