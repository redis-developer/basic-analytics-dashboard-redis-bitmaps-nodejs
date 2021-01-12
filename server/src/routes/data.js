const express = require('express');
const DataStoreController = require('../controllers/Data/StoreController');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const storeController = new DataStoreController(new RedisService());

    router.post('/', (...args) => storeController.invoke(...args));

    return router;
};
