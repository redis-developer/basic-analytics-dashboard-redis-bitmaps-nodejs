const redis = require('redis');
const {
    redis: { uri: redisUri }
} = require('../config');

const redisClient = redis.createClient(redisUri);

module.exports = redisClient;
