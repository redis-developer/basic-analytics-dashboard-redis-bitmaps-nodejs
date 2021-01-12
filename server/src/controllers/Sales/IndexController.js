const { StatusCodes } = require('http-status-codes');

class SalesIndexController {
    constructor(redisService) {
        this.redisService = redisService;
    }

    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const { period = null, search = null } = filter ? JSON.parse(filter) : {};

            const productsAddedToCart = await this._search(period, 'product_added_to_cart', search);
            const productsBought = await this._search(period, 'product_bought', search);

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

    async _search(period, prefix, search) {
        const periods = period ? [period] : ['dec_week_1', 'dec_week_2', 'dec_week_3', 'dec_week_4', 'dec_week_5'];

        if (search && typeof search === 'object' && Array.isArray(search)) {
            const results = {};

            for (const [index, productId] of search.entries()) {
                results[`product${index + 1}`] = await this._search(period, prefix, productId);
            }

            return results;
        }

        const productsIds = search ? [search] : [1, 2, 3];

        const keys = [];

        productsIds.forEach(productId => {
            const _key = `${prefix}:${productId}`;

            periods.forEach(period => keys.push(`${_key}:${period}`));
        });

        return this.redisService.calculateOr(keys);
    }
}

module.exports = SalesIndexController;
