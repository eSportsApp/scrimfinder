import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ComponentType, Colors } from "discord.js";
import { color, createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction, TextBasedChannels, TextChannel } from 'discord.js'
import db from "../utils/db";
import { getUser, isBanned } from "../utils/requests";

export const config = createCommandConfig({
    description: 'Setup a scrim channel',
    options: [{
        description: '',
        name: 'type',
        choices: [
            {
                name: 'scrim',
                value: 'scrim'
            }
        ],
        type: 'string',
        required: true
    },
    {
        description: '',
        name: 'game',
        choices: [
            {
                name: 'Rainbow Six Siege',
                value: 'r6'
            }
        ],
        type: 'string',
        required: true

    },
    {
        description: '',
        name: 'range',
        choices: [
            {
                name: 'G-I',
                value: 'default'
            },
            {
                name: 'D-F',
                value: 'df'
            }
        ],
        type: 'string',
        required: true
    },
    {
    description: 'channel',
    name: 'channel',
    type: 'channel',
    required: true
    }],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.Administrator
} as const)

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {
    const type = options.type
    const game = options.game
    const range = options.range
    const guildId = interaction.guildId as string;
    const channel = options.channel;
    let notallowed: boolean

    console.log(type, game, range, channel.id);
    if(type === 'scrim'){
        console.log('Scrim command detected');
        if(game === 'r6'){
            console.log('Rainbow Six Siege game detected');
            let guildDB = await db.guilds.findFirst({
                where: {
                    guildId: guildId
                } 
            });
            
            if(!guildDB) {
                await db.guilds.create({
                    data: {
                        guildId: guildId
                    }
                });
            }
            if (
                interaction.member && !((interaction.member.permissions as Readonly<PermissionsBitField>).has(
                  PermissionsBitField.Flags.Administrator
                ))
              ) {
                console.log('User does not have permission to use this command');
                return {
                    embeds: [
                      {
                        color: 16744192,
                        title: "Error 403",
                        url: "https://discord.gg/eSJufJn9DB",
                        description: "You do not have permission to use this command",
                        footer: {
                            text: 'scrimfinder.gg | Finding Scrims was never that easy',
                            icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                        },
                        timestamp: new Date().toISOString(),
                      }
                    ],
                    ephemeral: true,
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
                    ],
                  }
              }

              const isbanned = await isBanned(interaction.user.id);

              if(isbanned){
                console.log('User is banned from using this bot');
                return {
                    embeds: [
                      {
                        color: Colors.Red,
                        title: "Error",
                        url: "https://discord.gg/eSJufJn9DB",
                        description: "You are banned from using this bot",
                        footer: {
                            text: 'scrimfinder.gg | Finding Scrims was never that easy',
                            icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                        },
                        timestamp: new Date().toISOString(),
                      }
                    ],
                    ephemeral: true,
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    label: 'Appeal Ban',
                                    style: ButtonStyle.Link,
                                    url: 'discord://-/invite/eSJufJn9DB'
                                }
                            ]
                        }
                    ],
                  }
            }
            if(isbanned){
                // This fully quits the command if the user is banned
                return
            }
            if (range == "default") {
                if(guildDB && guildDB.rssGtoIid && guildDB.rssGtoIid.includes(channel.id)) {
                    console.log('This channel is already set as a scrim channel');
                    return{ 
                      embeds: [{
                        title: 'Error',
                        description: 'This channel is already set as a scrim channel',
                        color: Colors.Red,
                        footer: {
                            text: 'scrimfinder.gg | Finding Scrims was never that easy',
                            icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                        },
                      }],
                        ephemeral: true
                    };
                }

                let rssGtoIid = guildDB && guildDB.rssGtoIid ? [...guildDB.rssGtoIid, channel.id] : [channel.id];

                await db.guilds.update({
                    where: {
                      guildId: guildId
                    },
                    data: {
                      rssGtoIid: rssGtoIid
                    }
                })
            } else if (range == "df") {
                
                const user = await getUser(interaction.user.id);
                if(user && user.class && user.class !== "I" && user.class !== "H" && user.class !== "G") {
                    notallowed = true;
                    return { 
                      embeds: [{
                        title: 'Error 403',
                        description: 'You are not allowed to setup a scrim channel in this range',
                        color: Colors.Red,
                        footer: {
                            text: 'scrimfinder.gg | Finding Scrims was never that easy',
                            icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                        },
                      }],
                        ephemeral: true
                    };
                } else {
                  notallowed = false; 
                }
                if(notallowed){
                    return
                }

                if(guildDB && guildDB.rssDtoFid && guildDB.rssDtoFid.includes(channel.id)) {
                    return{
                        embeds: [{
                            title: 'Error',
                            description: 'This channel is already set as a scrim channel for range D-F',
                            color: Colors.Red,
                            footer: {
                                text: 'scrimfinder.gg | Finding Scrims was never that easy',
                                icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                            },
                        }],
                        ephemeral: true
                    };
                } else {
                    let rssDtoFid = guildDB && guildDB.rssDtoFid ? [...guildDB.rssDtoFid, channel.id] : [channel.id];

                    await db.guilds.update({
                        where: {
                          guildId: guildId
                        },
                        data: {
                          rssDtoFid: rssDtoFid
                        }
                      })
                }


                const setupChannel = interaction.guild?.channels.cache.get(channel.id) as TextChannel;
                try {
                    if (setupChannel) {
                        await setupChannel.send({ 
                            embeds: [{
                                title: 'Scrimfinder Setup Completed',
                                description: 'This channel is now set as a scrim channel',
                                color: 16744192,
                                footer: {
                                    text: 'scrimfinder.gg | Finding Scrims was never that easy',
                                    icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                                },
                            }]
                        });
                        console.log('Scrimfinder setup completed');
                        return{ 
                            embeds: [{
                                title: 'Success',
                                description: `You successfully set <#${channel.id}> as a scrim channel`,
                                color: 16744192,
                                footer: {
                                    text: 'scrimfinder.gg | Finding Scrims was never that easy',
                                    icon_url: 'https://maierfabian.de/images/lovepingu.png',	
                                },
                            }],
                            ephemeral: true
                        };
                    } else {
                        throw new Error("Setup channel is undefined.");
                    }
                } catch (error) {
                    console.log('Missing permissions to send messages in the specified channel');
                    return[{ 
                        content: "Missing permissions to send messages in the specified channel.",
                        ephemeral: true
                    }];
                }

        }
    }
    console.log('Invalid game');
    return [{
        embed: {
            title: 'Error',
            description: 'Invalid game',
            color: Colors.Red
        }
    }]
}}
