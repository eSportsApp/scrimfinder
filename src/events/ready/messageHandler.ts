import { Client } from 'discord.js';
import sclient from '../../utils/client';
import { messageHandler } from '../../utils/MessageHandler';

export default (client: Client) => {
        // Set the message handler
        sclient.setMessageHandler(messageHandler);
        // Connect to the Network
        sclient.connect(process.env.ESPORTSAPP_API_KEY);
};