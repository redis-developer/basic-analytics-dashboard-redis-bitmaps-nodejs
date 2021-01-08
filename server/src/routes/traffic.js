const express = require('express');
const TrafficIndexController = require('../controllers/Traffic/IndexController');
const router = express.Router();

module.exports = app => {
    const indexController = new TrafficIndexController();

    router.get('/', (...args) => indexController.invoke(...args));

    return router;
};
