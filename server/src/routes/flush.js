const express = require('express');
const router = express.Router();

module.exports = di => {
    const flushController = di.get('controllers.flush');

    router.delete('/', (...args) => flushController.invoke(...args));

    return router;
};
