require('dotenv').config();

const { PORT, REDIS_HOST, REDIS_PORT, REDIS_ENDPOINT_URI, REDIS_PASSWORD } = process.env;

const redisEndpointUri = REDIS_ENDPOINT_URI
    ? REDIS_ENDPOINT_URI.replace(/^(redis\:\/\/)/, '')
    : `${REDIS_HOST}:${REDIS_PORT}`;

module.exports = {
    server: {
        port: PORT || 3000
    },
    redis: {
        uri: `redis://${redisEndpointUri}`,
        password: REDIS_PASSWORD.length ? REDIS_PASSWORD : undefined
    },
    analytics: {
        prefix: 'analytics'
    }
};
