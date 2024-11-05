import {sendMessageToChannel, getChannelsForScrim, getChannelsForSharedScrim, getChannelsForGSAScrim} from '../utils/constants/helpers'
import { ButtonStyle, Client, Colors, ComponentType, EmbedBuilder, TextChannel } from 'discord.js'
import db from '../utils/db';

export default async function sendScrimMessage(message: Message, Client: Client) {
    const sentMessageIds: string[] = [];
    const sentChannelIds: string[] = [];
    const sentGuildIds: string[] = [];
    const rnchannelId: string = '1221536017203593226'; //719933814054584391
    const rnChannelguildId: string = '1201205703742869504'; //637333042301632535
    const fields: any[] = [];

    if (message.game == "r6"){
        if(message.extrainfo){
            fields.push({ name: 'Additional Infos', value: `${message.extrainfo}` });
           }
        //*today search
        if (message.date.toLowerCase() === "today" || message.date.toLowerCase() === "rn" || message.date.toLowerCase() === "now") {
            const specificChannel = await Client.channels.fetch(rnchannelId);
            try{
                if (specificChannel && specificChannel instanceof TextChannel && specificChannel.guild.id === rnChannelguildId) { 
                    const sentMessage = await specificChannel.send({embeds: [
                        {
                          color: 16744192, //#ff7700
                          author: {
                            name: `${message.user.displayName} is LFS`,
                            icon_url: `http://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}`,
                            url: `https://discordapp.com/users/${message.user.id}/`,
                            },
                          description: ` **${message.time}**     |     **Class ${message.class}**      |     **${message.best_of} Maps**`,
                            fields,
                          footer: {
                              text: `scrimfinder.gg | ${message.user.id}`,
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
                                              url: `discord://-/users/${message.user.id}`,
                                        }
                                    ]
                                }
                            ]
                          
                      });
                    sentMessageIds.push(sentMessage.id);
                    sentChannelIds.push(rnchannelId);
                    sentGuildIds.push(rnChannelguildId);
                }
            }catch(err){
                console.log(err);
            }
            
        }
        if (message.class === "I" || message.class === "H" || message.class === "G") {
            const channels = await getChannelsForScrim(message.class);

            if (channels.length) {
                for (const c of channels) {
                    const sentMessage = await sendMessageToChannel(Client, c, message);
                    if (sentMessage) {
                        sentMessageIds.push(sentMessage.id);
                        sentChannelIds.push(c);
                        if (sentMessage.guild) {
                            sentGuildIds.push(sentMessage.guild.id);
                        }
                    }
                }
            }
    }
    else {
        const channels = await getChannelsForGSAScrim();
        if (channels.length) {
          for (const c of channels) {
            
              const sentMessage = await sendMessageToChannel(Client, c, message);
              if (sentMessage) {
                  sentMessageIds.push(sentMessage.id);
                  sentChannelIds.push(c);
                  if (sentMessage.guild) {
                      sentGuildIds.push(sentMessage.guild.id);
                  }
              }
          }
        }
    }
      if (message.opensearch) {
        if (message.class === "I" || message.class === "H" || message.class === "G") {

        }else{
        const channels = await getChannelsForSharedScrim(message.class);
        
        if (channels.length) {
          for (const c of channels) {
            try {
              const sentMessage = await sendMessageToChannel(Client, c, message);
              if (sentMessage) {
                sentMessageIds.push(sentMessage.id);
                sentChannelIds.push(c);
                if (message.guildId) { // Check if interaction.guild exists before accessing its id
                  sentGuildIds.push(message.guildId);
                }
              }
            } catch (err) {
              console.log(`Failed to send message to channel: ${c}. Error: ${(err as Error).message}`);
            }
          }
        }
        }
      }
      try {
        await db.message.create({
          data: {
            content: ` **${message.date}      ${message.time} **     **Class ${message.class}**     **${message.best_of} Maps**`,
            messageIds: sentMessageIds,
            channelIds: sentChannelIds,
            guildIds: sentGuildIds,
            usersId: message.user.id,
            muuid: message.searchid,
          },
        });
    } catch (err) {
        console.log(`Failed to save message to database. Error: ${(err as Error).message}`);
    }
    }
}