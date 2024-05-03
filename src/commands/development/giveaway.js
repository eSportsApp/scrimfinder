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

        // Check if the user account is older than 6 months
const accountCreationDate = i.user.createdAt;
const currentDate = new Date();
const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));

if (accountCreationDate > sixMonthsAgo) {
    return i.reply({content:'Your account must be older than 6 months to participate in the giveaway!', ephemeral: true});
}

        if (!i.guild) {
            return i.reply('This command can only be used in a server!');
        }
        const members = await i.guild.members.fetch();

// Filter out the bots
const nonBotMembers = members.filter(member => !member.user.bot);

// Check if there are more than 5 non-bot members
if (nonBotMembers.size <= 5) {
    return i.reply({content: 'There must be more than 5 non-bot members in the server to participate in the giveaway!', ephemeral: true});
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
    return i.reply({content: 'You do not own this server!', ephemeral: true});
}

// Check if at least one of the rssGtoIid or rssDtoFid arrays exists and is not empty
if (!guild || (!guild.rssGtoIid.length && !guild.rssDtoFid.length)) {
    return i.reply({content: 'A channel needs to be set up first!', ephemeral: true});
}

        

        // If all checks pass, create a database entry in the giveaway table
        await db.giveaway.create({
            data: {
                userId: i.user.id,
                guildId: i.guild.id,
            },
        });



        const dm = new EmbedBuilder()
    .setColor('#ff7700')
    .setTitle('Hey, thanks for participating in the giveaway!')
    .setDescription(`If you haven't all ready, try using /findscrim for your next Scrimsearch!`);

// Send a DM to the user
await i.user.send({ embeds: [dm] });


const funFacts = [
    "Did you know that the first-ever recorded giveaway was in 1763? Crazy, right?",
    "There was an early alpha version of me back in 2023 that was never actively released to the public!",
    "One of the first Servers I was in after I got published was a server called 'ExMortis eSport'!",
    "Since I was announced at rcs I now have grown to over 100 Servers!",
    "My github repo gets usual 2-5 commits a day!",
    "currently are 13 Things on my todo list!",
    "The docs page is getting translated into 3 languages by some awesome volunteers!",
    "I am currently in over 100 Servers!",
    "The first ever command I had was /findscrim!",
    "The average maps searched are 2. Its interesting but I don't know why!",
    "The average time to find a scrim is well idk but it's fast!",
    "There is a 1 in 1000 chance that you get a beta invite from me if you use /findscrim!",
    "Everybody wants a multisearch feature but I don't have ideas how to implement it! Maybe you have an idea?",
    "In rcs there are 9 classes but class C is the one with the least amount of teams!",
    "The penguin you see everywhere does not have a name yet! Maybe you can help me with that?"

];

// Select a random fun fact
const funFact = funFacts[Math.floor(Math.random() * funFacts.length)];



        const infoEmbed = new EmbedBuilder()
        .setColor('#4CBD49')
        .setTitle('Giveaway')
        .setDescription(`You have successfully entered the giveaway!\n\nAnyways, here's a fun fact: ${funFact}`);
        await i.reply({ embeds: [infoEmbed]});
    }
}}