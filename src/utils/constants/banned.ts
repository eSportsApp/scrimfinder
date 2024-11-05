// Konstante für die Nachricht an gebannte Benutzer
import {EmbedBuilder } from 'discord.js';

const BANNED_USER_MESSAGE = new EmbedBuilder()
    .setTitle('You are banned from using the bot')
    .setColor('#ff7700')
    .setDescription('If you think this is a mistake, please contact us!');

export default BANNED_USER_MESSAGE;

// Export der Konstanten für die Verwendung in anderen Dateien
