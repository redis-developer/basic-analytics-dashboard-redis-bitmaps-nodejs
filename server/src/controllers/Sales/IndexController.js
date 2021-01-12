const { StatusCodes } = require('http-status-codes');

class SalesIndexController {
    constructor(redisService) {
        this.redisService = redisService;
    }

    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const { period = null } = filter ? JSON.parse(filter) : {};

            const productsAddedToCart = await this._search(period, 'product_added_to_cart');
            const productsBought = await this._search(period, 'product_bought');

            return res.send({
                productsAddedToCart,
                productsBought
            });
        } catch (err) {
            if (err instanceof SyntaxError) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }

            console.error(err);

            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    _search(period, prefix) {
        const periods = period ? [period] : ['dec_week_1', 'dec_week_2', 'dec_week_3', 'dec_week_4', 'dec_week_5'];

        const productsIds = [1, 2, 3];

        const keys = [];

        productsIds.forEach(productId => {
            const _key = `${prefix}:${productId}`;

            periods.forEach(period => keys.push(`${_key}:${period}`));
        });

        return this.redisService.calculateOr(keys);
    }
}

module.exports = SalesIndexController;
