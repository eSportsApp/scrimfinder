 //Imports 
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const { db } = require("./lib/db");
const path = require('path');
require('dotenv').config();

// Create Client instance
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.GuildInvites,
    ]
});


async function deleteOldMessages() {
    // Get the current date and time
    const now = new Date();

    // Subtract 3 days from the current date and time
    now.setDate(now.getDate() - 3);

    // Delete all messages that are older than 3 days
    await db.message.deleteMany({
        where: {
            createdAt: {
                lte: now,
            },
        },
    });
}

// Run the deleteOldMessages function every hour
setInterval(deleteOldMessages, 60 * 60 * 1000);

const schedule = require('node-schedule');
const db = require('./path/to/your/database'); // replace with your actual path

// Schedule a job to run at 10:00 on May 11
let date = new Date(2023, 4, 11, 10, 0, 0); // Note: JavaScript counts months from 0 (January) to 11 (December)

let job = schedule.scheduleJob(date, async function() {
    // Fetch all giveaways from the database
    let giveaways = await db.giveaway.findMany();

    // Select a random giveaway
    let randomGiveaway = giveaways[Math.floor(Math.random() * giveaways.length)];

    // Fetch the guild
    let guild = client.guilds.cache.get('637333042301632535'); // replace 'guild-id' with your actual guild ID

    if (!guild) {
        console.log('Guild not found');
        return;
    }

    // Fetch the channel
    let channel = guild.channels.cache.get('1229170409933508690'); // replace 'channel-id' with your actual channel ID

    // Send the message
    if (channel) {
        channel.send(`Congratulations <@${randomGiveaway.userId}>! You are the winner of the giveaway!\nPlease contact <@516206348568887316> in the next 24 hours to claim your prize.`);
    } else {
        console.log('Channel not found');
    }
});
// Create CommandHandler
new CommandHandler({
    client,
    commandsPath: path.join(__dirname, 'commands'),
    eventsPath: path.join(__dirname, 'events'),
    validationsPath: path.join(__dirname, 'validations')
});



// Bot login
(async () => {
    client.login(process.env.TOKEN);
})(); 