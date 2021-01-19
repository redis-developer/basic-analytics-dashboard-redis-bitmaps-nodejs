const express = require('express');
const DataStoreController = require('../controllers/Data/StoreController');
const AnalyzerService = require('../services/event/AnalyzerService');
const EventService = require('../services/event/EventService');
const TimeSpanService = require('../services/event/TimeSpanService');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const redisService = new RedisService();
    const timeSpanService = new TimeSpanService();

    const storeController = new DataStoreController(
        new EventService('analytics', redisService, timeSpanService),
        new AnalyzerService('analytics', redisService),
        timeSpanService
    );

    router.post('/', (...args) => storeController.invoke(...args));

    return router;
};
