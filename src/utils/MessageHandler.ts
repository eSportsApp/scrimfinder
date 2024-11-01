import sclient from './client';

let searchResult: { status: string, message: any } | null = null;

const messageHandler = (message: any) => {
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
            break;
    }
    console.log("Message handler Set");
};

export { messageHandler, searchResult };