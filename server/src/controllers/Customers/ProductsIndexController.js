const { StatusCodes } = require('http-status-codes');
const { SET, JOIN } = require('../../services/event/types');

class CustomersProductIndexController {
    constructor(redisService, periodService, analyzerService) {
        this.redisService = redisService;
        this.periodService = periodService;
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { filter, join, period = '2015-12' } = req.query;

        try {
            const { products = [] } = filter ? JSON.parse(filter) : { products: ['product1', 'product2', 'product3'] };

            const [firstProduct, secondProduct] = join ? JSON.parse(join) : [];

            const results = [];

            for (const product of products) {
                const boughtBy = await this.analyzerService
                    .analyze(SET, period, { action: 'buy', page: product })
                    .then(usersIds => usersIds.map(userId => `User${parseInt(userId) + 1}`));

                results.push({
                    type: 'product',
                    value: product,
                    boughtBy
                });
            }

            if (firstProduct && secondProduct) {
                const boughtBy = await this.analyzerService
                    .analyze(JOIN, period, {
                        first: { action: 'buy', page: firstProduct },
                        second: { action: 'buy', page: secondProduct }
                    })
                    .then(usersIds => usersIds.map(userId => `User${parseInt(userId) + 1}`));

                results.push({
                    type: 'products_join',
                    value: `${firstProduct}_${secondProduct}`,
                    boughtBy
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

module.exports = CustomersProductIndexController;
