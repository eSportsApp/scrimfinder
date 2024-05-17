const{ Redis } = require('ioredis');
require('dotenv').config();
//const redis = new Redis(process.env.REDIS_URL)
const redis = new Redis({
    port: 1032, // Redis port
    host: '80.91.223.183', // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: '5r4Yg8xzeNuoXCgkhPNjUe4js6IlxR',
    db: 0
  });
module.exports = redis;

