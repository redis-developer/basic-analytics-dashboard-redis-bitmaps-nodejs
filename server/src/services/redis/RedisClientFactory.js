const redis = require('redis');

class RedisClientFactory {
    static create({ uri, password }) {
        return redis.createClient(uri, { password });
    }
}

module.exports = RedisClientFactory;
