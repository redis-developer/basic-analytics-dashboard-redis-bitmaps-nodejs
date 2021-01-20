const express = require('express');
const router = express.Router();

module.exports = di => {
    const cohortShowController = di.get('controllers.customers.cohort.showController');
    const productsIndexController = di.get('controllers.customers.products.indexController');
    const retentionShowController = di.get('controllers.customers.retention.showController');

    router.get('/cohort', (...args) => cohortShowController.invoke(...args));
    router.get('/products', (...args) => productsIndexController.invoke(...args));
    router.get('/retention', (...args) => retentionShowController.invoke(...args));

    return router;
};
