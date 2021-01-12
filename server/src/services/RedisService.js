const { promisify } = require('util');
const faker = require('faker');
const redisClient = require('./RedisClient');

class RedisService {
    constructor() {
        this.redis = redisClient;
        ['SETBIT', 'BITCOUNT', 'BITOP', 'DEL'].forEach(method => (this.redis[method] = promisify(this.redis[method])));
    }

    storeTrafficPerPage(userId, period, page) {
        return this.redis.SETBIT(`traffic_per_page:${page}:${period}`, userId, 1);
    }

    storeTrafficPerSource(userId, period, source) {
        return this.redis.SETBIT(`traffic_per_source:${source}:${period}`, userId, 1);
    }

    async storeProductBought(userId, period, productId) {
        await this.storeProductAddedToCart(userId, period, productId);

        return this.redis.SETBIT(`product_bought:${productId}:${period}`, userId, 1);
    }

    storeProductAddedToCart(userId, period, productId) {
        return this.redis.SETBIT(`product_added_to_cart:${productId}:${period}`, userId, 1);
    }

    bitCount(key) {
        return this.redis.BITCOUNT(key);
    }

    async calculateOr(keys) {
        const key = `or:${faker.random.uuid()}`;

        await this.redis.BITOP('OR', key, ...keys);
        const count = await this.bitCount(key);

        await this.redis.DEL(key);

        return count;
    }
}

module.exports = RedisService;
