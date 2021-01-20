const { StatusCodes } = require('http-status-codes');
const { COUNT } = require('../../services/event/types');

class SalesIndexController {
    constructor(analyzerService) {
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { filter, period = '2015-12' } = req.query;

        const defaultFilter = { products: ['product1', 'product2', 'product3'], total: true };

        const { products = [], total = false } = filter ? JSON.parse(filter) : defaultFilter;

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
    }
}

module.exports = SalesIndexController;
