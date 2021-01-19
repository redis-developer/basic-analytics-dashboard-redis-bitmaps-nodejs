const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');
const { BITMAP } = require('../../services/event/types');

class CustomersCohortShowController {
    constructor(redisService, analyzerService) {
        this.redisService = redisService;
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { period = '2015-12' } = req.query;

        const registerThenBought = await this.analyzerService.analyze(BITMAP, period, { customName: 'cohort-buy' });
        const register = await this.analyzerService.analyze(BITMAP, period, { action: 'register' });
        const buy = await this.analyzerService.analyze(BITMAP, period, { action: 'buy' });
        const dropoff = 100 - ((registerThenBought / register) * 100).toFixed(2);

        return res.send({
            registerThenBought,
            register,
            buy,
            dropoff
        });
    }
}

module.exports = CustomersCohortShowController;
