import ScrimFinder from '../lib/client';
import apikey from './env';


let sclient: any;
if (apikey) {
  sclient = new ScrimFinder(apikey);
} else {
  throw new Error('eSportsApp API Key is required');
}

export default sclient;