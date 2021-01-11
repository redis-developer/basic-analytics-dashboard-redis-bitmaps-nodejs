const { StatusCodes } = require('http-status-codes');

class DataStoreController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
        this.periodService = periodService;
    }

    async invoke(req, res) {
        const { userId, date, action, source } = req.body;

        const period = this.periodService.getPeriodByDate(date);

        const actions = {
            homepage: {
                method: 'storeTrafficPerPage',
                params: [userId, period, 'homepage']
            },
            product1page: {
                method: 'storeTrafficPerPage',
                params: [userId, period, 'product1page']
            },
            product2page: {
                method: 'storeTrafficPerPage',
                params: [userId, period, 'product2page']
            },
            product3page: {
                method: 'storeTrafficPerPage',
                params: [userId, period, 'product3page']
            }
        };

        const _action = actions[action];

        if (!_action) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        await this.redisService[_action.method](..._action.params);

        await this.redisService.storeTrafficPerSource(userId, period, source);

        return res.sendStatus(StatusCodes.CREATED);
    }
}

module.exports = DataStoreController;
