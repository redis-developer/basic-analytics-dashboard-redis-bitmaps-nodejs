const { promisify } = require('util');
const { analytics } = require('../../config');

class RedisService {
    constructor(redis) {
        this.redis = redis;

        ['SETBIT', 'BITCOUNT', 'GET', 'SET', 'INCR', 'SADD', 'SMEMBERS', 'SINTER', 'DEL', 'SCAN'].forEach(
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

    async flush() {
        const keys = await this.scan(`${analytics.prefix}:*`);

        for (const key of keys) {
            await this.redis.del(key);
        }
    }

    async scan(pattern) {
        let matchingKeysCount = 0;
        let keys = [];

        const recursiveScan = async (cursor = '0') => {
            const [newCursor, matchingKeys] = await this.redis.SCAN(cursor, 'MATCH', pattern);
            cursor = newCursor;

            matchingKeysCount += matchingKeys.length;
            keys = keys.concat(matchingKeys);

            if (cursor === '0') {
                return keys;
            } else {
                return await recursiveScan(cursor);
            }
        };

        return await recursiveScan();
    }
}

module.exports = RedisService;
