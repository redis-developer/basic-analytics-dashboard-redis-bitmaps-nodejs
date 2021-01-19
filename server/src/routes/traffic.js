const express = require('express');
const TrafficIndexController = require('../controllers/Traffic/IndexController');
const TrafficTrendIndexController = require('../controllers/Traffic/TrendIndexController');
const AnalyzerService = require('../services/event/AnalyzerService');
const PeriodService = require('../services/PeriodService');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const redisService = new RedisService();
    const periodService = new PeriodService();
    const analyzerService = new AnalyzerService('analytics', redisService);

    const indexController = new TrafficIndexController(redisService, periodService, analyzerService);
    const trendIndexController = new TrafficTrendIndexController(redisService, periodService, analyzerService);

    router.get('/', (...args) => indexController.invoke(...args));
    router.get('/trend', (...args) => trendIndexController.invoke(...args));

    return router;
};
