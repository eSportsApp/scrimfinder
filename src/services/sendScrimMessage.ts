import {sendMessageToChannel, getChannelsForScrim, getChannelsForSharedScrim, constructInviteButton, constructContactRow, constructScrimsearchEmbed, getChannelsForGSAScrim} from '../utils/constants/helpers'
import { ButtonStyle, Client, Colors, ComponentType, EmbedBuilder, TextChannel } from 'discord.js'

export default async (message: Message, Client: Client) => {
    const sentMessageIds: string[] = [];
    const sentChannelIds: string[] = [];
    const sentGuildIds: string[] = [];
    const rnchannelId: string = '719933814054584391'; 
    const rnChannelguildId: string = '637333042301632535';

    if (message.game == "rss"){
        const contactRow = constructContactRow(message.user);
        if (message.class === "I" || message.class === "H" || message.class === "G") {
            const channels = await getChannelsForScrim(message.class);
            

            if (channels.length) {
                const scrimsearchEmbed = constructScrimsearchEmbed(
                    message.user,
                    message.date,
                    message.time,
                    message.best_of.toString(),
                    message.extrainfo || "",
                    message.class
                );
            }
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
                            icon_url: message.user.avatar,
                            url: `https://discordapp.com/users/${message.user.id}/`,
                            },
                          description: ` **${message.time}** |     **Class ${message.class}** |     **${message.best_of} Maps**`,
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
                                      label: 'Invite Me',
                                      style: ButtonStyle.Link,
                                      url: 'https://docs.scrimfinder.gg/invite'
                                  }
                              ]
                          }
                      ],});
                    sentMessageIds.push(sentMessage.id);
                    sentChannelIds.push(rnchannelId);
                    sentGuildIds.push(rnChannelguildId);
                }
            }catch(err){
                console.log(err);
              }
            
        }
    }
}