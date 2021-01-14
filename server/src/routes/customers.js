const express = require('express');
const CustomersCohortIndexController = require('../controllers/Customers/CohortIndexController');
const CustomersProductIndexController = require('../controllers/Customers/ProductsIndexController');
const PeriodService = require('../services/PeriodService');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const redisService = new RedisService();
    const periodService = new PeriodService();

    const cohortIndexController = new CustomersCohortIndexController(redisService, periodService);
    const productIndexController = new CustomersProductIndexController(redisService, periodService);

    router.get('/cohort', (...args) => cohortIndexController.invoke(...args));
    router.get('/products', (...args) => productIndexController.invoke(...args));

    return router;
};
