import {ButtonStyle, Colors, ComponentType, PermissionFlagsBits, TextChannel } from 'discord.js'
import { createCommandConfig } from 'robo.js'
import type { CommandOptions, CommandResult } from 'robo.js'
import type { CommandInteraction } from 'discord.js'
import ms from 'ms'
import db from '../utils/db'


export const config = createCommandConfig({
	description: 'See your Profile and all open Searches',
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    options: [{
        description: 'user to ban',
        name: 'user',
        type: 'user',
        required: true
        },
        {
            description: 'user to ban',
            name: 'user',
            type: 'user',
            required: true
        },
        {
            description: 'reason for ban',
            name: 'reason',
            type: 'string',
            required: true
        },
        {
            description: 'duration of ban',
            name: 'duration',
            type: 'string',
            required: true
        }]
} as const)

export default async (interaction: CommandInteraction, options: CommandOptions<typeof config>) => {

    const user = options.user;
    const reason = options.reason;
    const duration = options.duration;
    const datetilunban = new Date(Date.now() + ms(duration));
    console.log('user', user);
   const dbUser = await db.networkusers.findUnique({where: {userId: user.id}});
    if(!dbUser){
        db.networkusers.create({
            data: {
                userId: user.id,
                username: user.username,
                rssclass: 'I',
                rssClan: null,
                mena: false,
                probation: false,
                banned: true,
                rcsbans: {
                    create: [{
                        userId: user.id,
                        reason: options.reason,
                        bannedtil: datetilunban,
                        date: new Date(),
                        bannedBy: interaction.user.id
                    }]
                }
            }
        });
    } else {
        db.networkusers.update({
            where: {userId: user.id},
            data: {
                banned: true,
                rcsbans: {
                    create: [{
                        userId: user.id,
                        reason: options.reason,
                        bannedtil: datetilunban,
                        date: new Date(),
                        bannedBy: interaction.user.id
                    }]
                }
            }
        });
    }
    const guildId = interaction.guildId;
    const channelId = '1221536063751716895';
    const channel = interaction.client.channels.cache.get(channelId);
    const roleToRssClassMap: { [key: string]: string } = {
        '638375833928466433': 'A',
        '637337720779309056': 'B',
        '638038928837836800': 'C',
        '637338342869958659': 'D',
        '792776430312357958': 'E',
        '719907815434616893': 'F',
        '1066713175795445850': 'G',
        '637972946551570432': 'H',
        '685202104897503240': 'I',
      };

    if (channel instanceof TextChannel) {
        channel.send('Your message here');
    }

   
      
    return {
        ephemeral: true,
        embeds: [{
            title: `🔨 Ban got through`,
            url: 'https://docs.esportsapp.gg',
            description: `Successfully banned`,
            color: 16744192,
            footer: {
                text: 'Rainbow Class System',
                icon_url: 'https://maierfabian.de/images/lovepingu.png',	
            },
        }]
    }
}