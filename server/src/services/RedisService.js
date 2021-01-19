const { promisify } = require('util');
const faker = require('faker');
const redisClient = require('./RedisClient');

class RedisService {
    constructor() {
        this.redis = redisClient;
        [
            'SETBIT',
            'GETBIT',
            'BITCOUNT',
            'BITOP',
            'BITPOS',
            'DEL',
            'GET',
            'SET',
            'INCR',
            'SADD',
            'SMEMBERS',
            'SCARD'
        ].forEach(method => (this.redis[method] = promisify(this.redis[method])));
    }

    storeTrafficPerPage(userId, date, page) {
        return this.redis.SETBIT(`traffic_per_page:${page}:${date}`, userId, 1);
    }

    storeTrafficPerSource(userId, date, source) {
        return this.redis.SETBIT(`traffic_per_source:${source}:${date}`, userId, 1);
    }

    async storeProductBought(userId, date, productId) {
        await this.storeProductAddedToCart(userId, date, productId);

        return this.redis.SETBIT(`product_bought:${productId}:${date}`, userId, 1);
    }

    storeProductAddedToCart(userId, date, productId) {
        return this.redis.SETBIT(`product_added_to_cart:${productId}:${date}`, userId, 1);
    }

    storeRegisterUsers(userId, date) {
        return this.redis.SETBIT(`registration:${date}`, userId, 1);
    }

    async calculateSum(keys) {
        let sum = 0;

        for (const key of keys) {
            const count = await this.countBit(key);
            sum += count;
        }

        return sum;
    }

    async calculateUniques(keys, keep = false) {
        const key = `or:${faker.random.uuid()}`;

        await this.redis.BITOP('OR', key, ...keys);

        if (keep) {
            return key;
        }

        const count = await this.countBit(key);

        await this.delete(key);

        return count;
    }

    async calculateIntersection(keys, keep = false) {
        const key = `and:${faker.random.uuid()}`;

        await this.redis.BITOP('AND', key, ...keys);

        if (keep) {
            return key;
        }

        const count = await this.countBit(key);

        await this.delete(key);

        return count;
    }

    async generateArrayFromBits(key, itemPrefix) {
        let index;

        const result = [];

        if (!key || !itemPrefix) {
            return result;
        }

        do {
            index = await this.redis.BITPOS(key, 1);

            if (index < 0) {
                break;
            }

            result.push(`${itemPrefix}${index + 1}`);

            await this.redis.SETBIT(key, index, 0);
        } while (true);

        return result;
    }

    // ----------------------------- //

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
}

module.exports = RedisService;
