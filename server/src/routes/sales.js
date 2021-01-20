const express = require('express');
const router = express.Router();

module.exports = di => {
    const indexController = di.get('controllers.sales.indexController');

    router.get('/', (...args) => indexController.invoke(...args));

    return router;
};
