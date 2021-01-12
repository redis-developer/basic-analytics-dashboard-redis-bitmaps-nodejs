const { StatusCodes } = require('http-status-codes');

class DataStoreController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
    }

    async invoke(req, res) {
        const { userId, date, action, source } = req.body;

        const actions = {
            homepage: {
                method: 'storeTrafficPerPage',
                params: [userId, date, 'homepage']
            },
            product1page: {
                method: 'storeTrafficPerPage',
                params: [userId, date, 'product1page']
            },
            product2page: {
                method: 'storeTrafficPerPage',
                params: [userId, date, 'product2page']
            },
            product3page: {
                method: 'storeTrafficPerPage',
                params: [userId, date, 'product3page']
            },
            product1cart: {
                method: 'storeProductAddedToCart',
                params: [userId, date, 1]
            },
            product2cart: {
                method: 'storeProductAddedToCart',
                params: [userId, date, 2]
            },
            product3cart: {
                method: 'storeProductAddedToCart',
                params: [userId, date, 3]
            },
            product1buy: {
                method: 'storeProductBought',
                params: [userId, date, 1]
            },
            product2buy: {
                method: 'storeProductBought',
                params: [userId, date, 2]
            },
            product3buy: {
                method: 'storeProductBought',
                params: [userId, date, 3]
            }
        };

        const _action = actions[action];

        if (!_action) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        await this.redisService[_action.method](..._action.params);

        await this.redisService.storeTrafficPerSource(userId, date, source);

        return res.sendStatus(StatusCodes.CREATED);
    }
}

module.exports = DataStoreController;
