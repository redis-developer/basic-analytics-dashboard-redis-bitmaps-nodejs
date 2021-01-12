const express = require('express');
const SalesIndexController = require('../controllers/Sales/IndexController');
const RedisService = require('../services/RedisService');
const router = express.Router();

module.exports = app => {
    const indexController = new SalesIndexController(new RedisService());

    router.get('/', (...args) => indexController.invoke(...args));

    return router;
};
