import { Client } from 'discord.js';
import sclient from '../../utils/client';
import sendScrimMessage from '../../services/sendScrimMessage';
import closeScrimMessage from '../../services/closeScrimSearch';
import apikey from '../../utils/env';
import { close } from 'fs';
let searchResult: { status: string, message: any } | null = null;

export default (client: Client) => {
    const messageHandler = (message: any) => {
        switch (message.type) {
            case 'search':
                sendScrimMessage(message, client);
                break;
            case 'closerequest':
                closeScrimMessage(message, client);
                break;
            case 'banned':
                searchResult = { status: 'banned', message };
                break; 
            case 'success':
                searchResult = { status: 'success', message };
                break;
            default:
                console.log("unknown message type");
                break;
        }
        console.log("Message handler Set");
    };
        // Set the message handler
        sclient.setMessageHandler(messageHandler);
        // Connect to the Network
        sclient.connect(apikey, "Scrimfinder");
};