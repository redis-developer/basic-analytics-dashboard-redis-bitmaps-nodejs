const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');
const { COUNT, SET, BITMAP } = require('../../services/event/types');

class DataStoreController {
    constructor(eventService, analyzerService, timeSpanService) {
        this.eventService = eventService;
        this.analyzerService = analyzerService;
        this.timeSpanService = timeSpanService;
    }

    async invoke(req, res) {
        const { userId, date, action, source } = req.body;

        const actionParams = {
            register: [userId, date, { source, action: 'register' }],
            homepage: [userId, date, { source, action: 'visit', page: 'homepage' }],
            product1page: [userId, date, { source, action: 'visit', page: 'product1' }],
            product2page: [userId, date, { source, action: 'visit', page: 'product2' }],
            product3page: [userId, date, { source, action: 'visit', page: 'product3' }],
            product1cart: [userId, date, { source, action: 'addToCart', page: 'product1' }],
            product2cart: [userId, date, { source, action: 'addToCart', page: 'product2' }],
            product3cart: [userId, date, { source, action: 'addToCart', page: 'product3' }],
            product1buy: [userId, date, { source, action: 'buy', page: 'product1' }],
            product2buy: [userId, date, { source, action: 'buy', page: 'product2' }],
            product3buy: [userId, date, { source, action: 'buy', page: 'product3' }]
        };

        const params = actionParams[action];

        if (!params) {
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }

        if (params[2].action === 'buy') {
            const monthRegisterCount = await this.analyzerService.analyze(
                COUNT,
                this.timeSpanService.month(dayjs(date)),
                {
                    action: 'register',
                    userId
                }
            );

            const todayBuyCount = await this.analyzerService.analyze(COUNT, this.timeSpanService.day(dayjs(date)), {
                action: 'buy',
                userId
            });

            const anytimeBuyCount = await this.analyzerService.analyze(COUNT, this.timeSpanService.anytime(), {
                action: 'buy',
                userId
            });

            if (anytimeBuyCount > todayBuyCount) {
                await this.eventService.store(SET, 'retention-buy', userId, this.timeSpanService.all(dayjs(date)));
            }

            if (monthRegisterCount > 0) {
                await this.eventService.store(BITMAP, 'cohort-buy', userId, this.timeSpanService.all(dayjs(date)));
            }
        }

        await this.eventService.storeAll(...params);

        return res.sendStatus(StatusCodes.CREATED);
    }
}

module.exports = DataStoreController;
