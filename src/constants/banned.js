// Konstante für die Nachricht an gebannte Benutzer
const {EmbedBuilder } = require('discord.js');

const BANNED_USER_MESSAGE = new EmbedBuilder()
    .setTitle('You are banned from using the bot')
    .setColor('#ff7700')
    .setDescription('If you think this is a mistake, please contact us!');

// Export der Konstanten für die Verwendung in anderen Dateien
module.exports = {
  BANNED_USER_MESSAGE: BANNED_USER_MESSAGE
};