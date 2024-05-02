const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require("../../lib/db");
module.exports = {
    
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Participate in the giveaway!'),
    run: async ({interaction, client}) => {
        const i = interaction;

        // Check if the user is already in the giveaway
        const existingEntry = await db.giveaway.findUnique({
            where: {
                userId: i.user.id,
            },
        });

        if (existingEntry) {
            return i.reply('You are already participating in the giveaway!');
        }
        if (!i.guild) {
            return i.reply('This command can only be used in a server!');
        }
        if(!existingEntry){
       // Check if the guild has a g-i or d-f channel
const guild = await db.guilds.findUnique({
    where: {
        guildId: i.guild.id,
    },
});

// Check if the user is the owner of the server
if (i.guild.ownerId !== i.user.id) {
    return i.reply('You do not own this server!');
}

// Check if at least one of the rssGtoIid or rssDtoFid arrays exists and is not empty
if (!guild || (!guild.rssGtoIid.length && !guild.rssDtoFid.length)) {
    return i.reply('A channel needs to be set up first!');
}

        

        // If all checks pass, create a database entry in the giveaway table
        await db.giveaway.create({
            data: {
                userId: i.user.id,
                guildId: i.guild.id,
            },
        });
        const infoEmbed = new EmbedBuilder()
        .setColor('#4CBD49')
        .setTitle('Giveaway')
        .setDescription('You have successfully entered the giveaway!');
        await i.reply({ embeds: [infoEmbed]});
    }
}}