const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');

class CustomersProductIndexController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
        this.periodService = periodService;
    }

    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const {
                period = null,
                search = ['product1', 'product2', 'product3', 'product1and2', 'twoDifferentDates']
            } = filter ? JSON.parse(filter) : {};

            const dates =
                period && typeof period === 'object' && period.from && period.to
                    ? this.periodService.getRangeOfDates(dayjs(period.from), period.to, 'day', [dayjs(period.from)])
                    : this.periodService.getRangeOfDates(dayjs('2015-12-01'), '2015-12-31', 'day', [
                          dayjs('2015-12-01')
                      ]);

            const productsIds = [1, 2, 3];

            const keys = { product1: [], product2: [], product3: [], dates: [] };

            productsIds.forEach(productId => {
                const _key = `product_bought:${productId}`;

                dates.forEach(date => keys[`product${productId}`].push(`${_key}:${date.format('YYYY-MM-DD')}`));
            });

            const result = {};

            const buyProduct1Key = await this.redisService.calculateUniques(keys.product1, true);
            const buyProduct2Key = await this.redisService.calculateUniques(keys.product2, true);

            if (search.includes('product1and2')) {
                const buyProduct1and2Key = await this.redisService.calculateIntersection(
                    [buyProduct1Key, buyProduct2Key],
                    true
                );

                result.product1and2 = await this.redisService.generateArrayFromBits(buyProduct1and2Key, 'User');

                await this.redisService.delete(buyProduct1and2Key);
            }

            if (search.includes('twoDifferentDates')) {
                const calculatedKeys = [];

                for (const date of dates) {
                    const keysWithDate = keys.product1.concat(keys.product2, keys.product3).filter(key => {
                        const keyParts = key.split(':');
                        const _date = keyParts[keyParts.length - 1];

                        return _date === date.format('YYYY-MM-DD');
                    });

                    const keysWithoutDate = keys.product1.concat(keys.product2, keys.product3).filter(key => {
                        const keyParts = key.split(':');
                        const _date = keyParts[keyParts.length - 1];

                        return _date !== date.format('YYYY-MM-DD');
                    });

                    const withDateUniqueKey = await this.redisService.calculateUniques(keysWithDate, true);
                    const withoutDateUniqueKey = await this.redisService.calculateUniques(keysWithoutDate, true);

                    const calculatedKey = await this.redisService.calculateIntersection(
                        [withDateUniqueKey, withoutDateUniqueKey],
                        true
                    );

                    calculatedKeys.push(calculatedKey);

                    await this.redisService.delete(withDateUniqueKey);
                    await this.redisService.delete(withoutDateUniqueKey);
                }

                const twoDifferetDatesKey = await this.redisService.calculateUniques(calculatedKeys, true);

                result.twoDifferentDates = await this.redisService.generateArrayFromBits(twoDifferetDatesKey, 'User');

                await this.redisService.delete(twoDifferetDatesKey);

                for (const calculatedKey of calculatedKeys) {
                    await this.redisService.delete(calculatedKey);
                }
            }

            if (search.includes('product1')) {
                result.product1 = await this.redisService.generateArrayFromBits(buyProduct1Key, 'User');
            }

            if (search.includes('product2')) {
                result.product2 = await this.redisService.generateArrayFromBits(buyProduct2Key, 'User');
            }

            if (search.includes('product3')) {
                const buyProduct3Key = await this.redisService.calculateUniques(keys.product3, true);

                result.product3 = await this.redisService.generateArrayFromBits(buyProduct3Key, 'User');

                await this.redisService.delete(buyProduct3Key);
            }

            await this.redisService.delete(buyProduct1Key);
            await this.redisService.delete(buyProduct2Key);

            return res.send(result);
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
