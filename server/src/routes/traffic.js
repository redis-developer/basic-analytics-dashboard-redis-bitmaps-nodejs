const express = require('express');
const router = express.Router();

module.exports = di => {
    const indexController = di.get('controllers.traffic.indexController');
    const trendIndexController = di.get('controllers.traffic.trend.indexController');

    router.get('/', (...args) => indexController.invoke(...args));
    router.get('/trend', (...args) => trendIndexController.invoke(...args));

    return router;
};
