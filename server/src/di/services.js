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
        'services.event.keyGenerator': {
            class: 'services/event/KeyGeneratorService',
            arguments: [config.analytics.prefix]
        },
        'services.event.analyzer': {
            class: 'services/event/AnalyzerService',
            arguments: ['@services.redis', '@services.event.keyGenerator']
        },
        'services.event.timeSpan': {
            class: 'services/event/TimeSpanService',
            arguments: ['%dayjs']
        },
        'services.event.event': {
            class: 'services/event/EventService',
            arguments: ['@services.redis', '@services.event.timeSpan', '@services.event.keyGenerator']
        },
        'services.data.store': {
            class: 'services/data/StoreDataService',
            arguments: ['@services.event.event', '@services.event.analyzer', '@services.event.timeSpan']
        },
        'services.data.sample': {
            class: 'services/data/SampleDataService',
            arguments: ['@services.data.store', '@services.redis']
        },
        'services.period': {
            class: 'services/PeriodService',
            arguments: ['%dayjs']
        }
    }
};
