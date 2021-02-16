module.exports = {
    services: {
        'controllers.flush': {
            class: 'controllers/FlushController',
            arguments: ['@services.redis']
        },
        'controllers.reset': {
            class: 'controllers/ResetController',
            arguments: ['@services.data.sample']
        },
        'controllers.data.storeController': {
            class: 'controllers/Data/StoreController',
            arguments: ['@services.data.store']
        },
        'controllers.customers.cohort.showController': {
            class: 'controllers/Customers/CohortShowController',
            arguments: ['@services.event.analyzer']
        },
        'controllers.customers.products.indexController': {
            class: 'controllers/Customers/ProductsIndexController',
            arguments: ['@services.event.analyzer']
        },
        'controllers.customers.retention.showController': {
            class: 'controllers/Customers/RetentionShowController',
            arguments: ['@services.event.analyzer']
        },
        'controllers.sales.indexController': {
            class: 'controllers/Sales/IndexController',
            arguments: ['@services.event.analyzer']
        },
        'controllers.traffic.indexController': {
            class: 'controllers/Traffic/IndexController',
            arguments: ['@services.event.analyzer']
        },
        'controllers.traffic.trend.indexController': {
            class: 'controllers/Traffic/TrendIndexController',
            arguments: ['@services.period', '@services.event.analyzer']
        }
    }
};
