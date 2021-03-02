require('dotenv').config();

const sanitizeRedisUrl = url => url.replace(/^(redis\:\/\/)/, '');

const { PORT, REDIS_HOST, REDIS_PORT, REDIS_ENDPOINT_URI, REDIS_PASSWORD } = process.env;

const redisEndpointUri = REDIS_ENDPOINT_URI
    ? sanitizeRedisUrl(REDIS_ENDPOINT_URI)
    : `${sanitizeRedisUrl(REDIS_HOST)}:${REDIS_PORT}`;

module.exports = {
    server: {
        port: PORT || 3000
    },
    redis: {
        uri: `redis://${redisEndpointUri}`,
        password: REDIS_PASSWORD || undefined
    },
    analytics: {
        prefix: 'rab'
    }
};
