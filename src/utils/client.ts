import ScrimFinder from '../lib/client';
const key = process.env.ESPORTSAPP_API_KEY;
let sclient: any;
if (key) {
  sclient = new ScrimFinder(key);
} else {
  throw new Error('eSportsApp API Key is required');
}

export default sclient;