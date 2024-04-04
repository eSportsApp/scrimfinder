// Imports
const { Client, IntentsBitField } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
require('dotenv').config();

// Create Client instance
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
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