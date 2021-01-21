const { promisify } = require('util');

class RedisService {
    constructor(redis) {
        this.redis = redis;

        ['SETBIT', 'BITCOUNT', 'GET', 'SET', 'INCR', 'SADD', 'SMEMBERS', 'SINTER', 'FLUSHALL'].forEach(
            method => (this.redis[method] = promisify(this.redis[method]))
        );
    }

    get(key) {
        return this.redis.GET(key);
    }

    set(key, value) {
        if (!key || !value) {
            return;
        }

        return this.redis.SET(key, value);
    }

    setBit(key, bit, value) {
        return this.redis.SETBIT(key, bit, value);
    }

    countBit(key) {
        return this.redis.BITCOUNT(key);
    }

    increment(key) {
        return this.redis.INCR(key);
    }

    addToSet(key, member) {
        return this.redis.SADD(key, member);
    }

    getSetValues(key) {
        return this.redis.SMEMBERS(key);
    }

    getSetIntersection(key1, key2) {
        return this.redis.SINTER(key1, key2);
    }

    flush() {
        return this.redis.FLUSHALL();
    }
}

module.exports = RedisService;
