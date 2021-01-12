const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');

class SalesIndexController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
        this.periodService = periodService;
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
        const dates =
            period && typeof period === 'object' && period.from && period.to
                ? this.periodService.getRangeOfDates(dayjs(period.from), period.to, 'day', [dayjs(period.from)])
                : this.periodService.getRangeOfDates(dayjs('2015-12-01'), '2015-12-31', 'day', [dayjs('2015-12-01')]);

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

            dates.forEach(date => keys.push(`${_key}:${date.format('YYYY-MM-DD')}`));
        });

        if (keys.length === 0) {
            return 0;
        }

        return this.redisService.calculateSum(keys);
    }
}

module.exports = SalesIndexController;
