import { Client } from 'discord.js';
import sclient from '../../utils/client';
import sendScrimMessage from '../../services/sendScrimMessage';
import apikey from '../../utils/env';
let searchResult: { status: string, message: any } | null = null;

export default (client: Client) => {
    const messageHandler = (message: any) => {
        switch (message.type) {
            case 'search':
                sendScrimMessage(message, client);
                console.log("searching for scrims");
                break;
            case 'closerequest':
                console.log("closing request");
                break;
            case 'banned':
                console.log("banned user", message);
                searchResult = { status: 'banned', message };
                break; 
            case 'success':
                console.log("success", message);
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
        sclient.connect(apikey);
};