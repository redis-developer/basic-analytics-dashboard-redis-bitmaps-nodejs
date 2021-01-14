const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');

class CustomersCohortIndexController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
        this.periodService = periodService;
    }

    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const { period = null, search = null } = filter ? JSON.parse(filter) : {};

            const dates =
                period && typeof period === 'object' && period.from && period.to
                    ? this.periodService.getRangeOfDates(dayjs(period.from), period.to, 'day', [dayjs(period.from)])
                    : this.periodService.getRangeOfDates(dayjs('2015-12-01'), '2015-12-31', 'day', [
                          dayjs('2015-12-01')
                      ]);

            const iterations = [];

            const productsIds = search ? [search] : [1, 2, 3];

            for (const date of dates) {
                const productsKeys = [];
                const _dates = dates.filter(d => dayjs(d).isAfter(date));

                productsIds.forEach(productId => {
                    const _key = `product_bought:${productId}`;

                    _dates.forEach(d => productsKeys.push(`${_key}:${d.format('YYYY-MM-DD')}`));
                });

                iterations.push({ registrationKey: `registration:${date.format('YYYY-MM-DD')}`, productsKeys });
            }

            const cohortKeys = [];
            const registrationKeys = [];
            const boughtKeys = [];

            for (const iteration of iterations) {
                if (iteration.productsKeys.length === 0) {
                    continue;
                }

                const productBoughtKey = await this.redisService.calculateUniques(iteration.productsKeys, true);
                const cohortKey = await this.redisService.calculateIntersection(
                    [iteration.registrationKey, productBoughtKey],
                    true
                );

                boughtKeys.push(productBoughtKey);
                registrationKeys.push(iteration.registrationKey);
                cohortKeys.push(cohortKey);
            }

            const registerThenBought = await this.redisService.calculateUniques(cohortKeys);
            const register = await this.redisService.calculateUniques(registrationKeys);
            const bought = await this.redisService.calculateUniques(boughtKeys);
            const dropoff = 100 - ((registerThenBought / register) * 100).toFixed(2);

            for (const cohortKey of cohortKeys) {
                await this.redisService.delete(cohortKey);
            }

            for (const boughtKey of boughtKeys) {
                await this.redisService.delete(boughtKey);
            }

            return res.send({ registerThenBought, register, bought, dropoff });
        } catch (err) {
            if (err instanceof SyntaxError) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }

            console.error(err);

            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = CustomersCohortIndexController;
