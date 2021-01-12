const redis = require('redis');
const {
    redis: { uri, password }
} = require('../config');

const redisClient = redis.createClient(uri, { password });

module.exports = redisClient;
