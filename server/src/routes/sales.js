const express = require('express');
const SalesIndexController = require('../controllers/Sales/IndexController');
const PeriodService = require('../services/PeriodService');
const RedisService = require('../services/RedisService');
const AnalyzerService = require('../services/event/AnalyzerService');
const router = express.Router();

module.exports = app => {
    const redisService = new RedisService();
    const periodService = new PeriodService();
    const analyzerService = new AnalyzerService('analytics', redisService);

    const indexController = new SalesIndexController(redisService, periodService, analyzerService);

    router.get('/', (...args) => indexController.invoke(...args));

    return router;
};
