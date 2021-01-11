const express = require('express');
const DataStoreController = require('../controllers/Data/StoreController');
const PeriodService = require('../services/PeriodService');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const storeController = new DataStoreController(new RedisService(), new PeriodService());

    router.post('/', (...args) => storeController.invoke(...args));

    return router;
};
