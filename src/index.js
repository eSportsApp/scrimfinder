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