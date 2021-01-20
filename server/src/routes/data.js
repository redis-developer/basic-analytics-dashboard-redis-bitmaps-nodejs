const express = require('express');
const router = express.Router();

module.exports = di => {
    const storeController = di.get('controllers.data.storeController');

    router.post('/', (...args) => storeController.invoke(...args));

    return router;
};
