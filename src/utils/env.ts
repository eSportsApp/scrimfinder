import dotenv from 'dotenv';
dotenv.config();

const apikey: string = process.env.ESPORTSAPP_API_KEY;
console.log(apikey);
export default apikey;