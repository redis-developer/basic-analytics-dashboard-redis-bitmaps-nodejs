const config = require('../config');

module.exports = {
    parameters: {
        'config.redis': config.redis
    },
    services: {
        redis: {
            factory: {
                class: 'services/redis/RedisClientFactory',
                method: 'create'
            },
            arguments: ['%config.redis%']
        },
        'services.redis': {
            class: 'services/redis/RedisService',
            arguments: ['@redis']
        },
        'services.event.analyzer': {
            class: 'services/event/AnalyzerService',
            arguments: [config.analytics.prefix, '@services.redis']
        },
        'services.event.timeSpan': {
            class: 'services/event/TimeSpanService'
        },
        'services.event.event': {
            class: 'services/event/EventService',
            arguments: [config.analytics.prefix, '@services.redis', '@services.event.timeSpan']
        },
        'services.period': {
            class: 'services/PeriodService'
        }
    }
};
