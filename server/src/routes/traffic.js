const express = require('express');
const TrafficIndexController = require('../controllers/Traffic/IndexController');
const PeriodService = require('../services/PeriodService');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const indexController = new TrafficIndexController(new RedisService(), new PeriodService());

    router.get('/', (...args) => indexController.invoke(...args));

    return router;
};
