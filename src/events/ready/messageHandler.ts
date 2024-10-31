import { ActivityType, Client } from 'discord.js'
import sclient from '../../utils/client'
let searchResult: { status: string, message: any } | null = null;

export default async (client: Client) => {
	
    sclient.setMessageHandler((message: any) => {
        switch (message.type) {
            case 'search':
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
                //* handle unknown message type (only for debugging normally nothing should come here)
                break;
        }
    });
   
}
export { searchResult };
