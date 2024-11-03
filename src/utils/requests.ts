import axios from 'axios';
import apikey from './env';
export async function getUser(userId: string) {
    try {
        const response = await axios.get(`https://api.esportsapp.gg/network/getuser/${userId}`, {
            headers: {
                'api-key': apikey
            }
        });
        const user = response.data;
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function isBanned(userId: string) {
    try {
        const response = await axios.get(`https://api.esportsapp.gg/network/isbanned/${userId}`, {
            headers: {
                'api-key': apikey
            }
        });
        const banned = response.data.banned;
        return banned;
    } catch (error) {
        console.error('Error fetching banned status:', error);
        throw error;
    }
}