const { promisify } = require('util');
const faker = require('faker');
const redisClient = require('./RedisClient');

class RedisService {
    constructor() {
        this.redis = redisClient;
        ['SETBIT', 'BITCOUNT', 'BITOP', 'DEL'].forEach(method => (this.redis[method] = promisify(this.redis[method])));
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

    count(key) {
        return this.redis.BITCOUNT(key);
    }

    async calculateSum(keys) {
        let sum = 0;

        for (const key of keys) {
            const count = await this.count(key);
            sum += count;
        }

        return sum;
    }

    async calculateUniques(keys) {
        const key = `or:${faker.random.uuid()}`;

        await this.redis.BITOP('OR', key, ...keys);
        const count = await this.count(key);

        await this.redis.DEL(key);

        return count;
    }
}

module.exports = RedisService;
