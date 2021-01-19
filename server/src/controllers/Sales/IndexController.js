const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');
const { COUNT } = require('../../services/event/types');

class SalesIndexController {
    constructor(redisService, periodService, analyzerService) {
        this.redisService = redisService;
        this.periodService = periodService;
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { filter, period = '2015-12' } = req.query;

        try {
            const { products = [], total = false } = filter
                ? JSON.parse(filter)
                : { products: ['product1', 'product2', 'product3'], total: true };

            const results = [];

            if (total) {
                const addedToCart = await this.analyzerService.analyze(COUNT, period, { action: 'addToCart' });
                const bought = await this.analyzerService.analyze(COUNT, period, { action: 'buy' });

                results.push({
                    type: 'total',
                    addedToCart,
                    bought
                });
            }

            for (const product of products) {
                const addedToCart = await this.analyzerService.analyze(COUNT, period, {
                    action: 'addToCart',
                    page: product
                });

                const bought = await this.analyzerService.analyze(COUNT, period, { action: 'buy', page: product });

                results.push({
                    type: 'product',
                    value: product,
                    addedToCart,
                    bought
                });
            }

            return res.send(results);
        } catch (err) {
            if (err instanceof SyntaxError) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }

            console.error(err);

            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = SalesIndexController;
