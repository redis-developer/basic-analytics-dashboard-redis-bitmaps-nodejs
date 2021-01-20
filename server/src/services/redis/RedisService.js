const { promisify } = require('util');

class RedisService {
    constructor(redis) {
        this.redis = redis;

        [
            'SETBIT',
            'GETBIT',
            'BITCOUNT',
            'DEL',
            'GET',
            'SET',
            'INCR',
            'SADD',
            'SMEMBERS',
            'SCARD',
            'SINTER',
            'FLUSHALL'
        ].forEach(method => (this.redis[method] = promisify(this.redis[method])));
    }

    delete(key) {
        return this.redis.DEL(key);
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

    getBit(key, bit) {
        return this.redis.GETBIT(key, bit);
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

    getSetLength(key) {
        return this.redis.SCARD(key);
    }

    getSetIntersection(key1, key2) {
        return this.redis.SINTER(key1, key2);
    }

    flush() {
        return this.redis.FLUSHALL();
    }
}

module.exports = RedisService;
