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
        const { userId, date, actionParams, source } = req.body;

        if (actionParams.action === 'buy') {
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

        await this.eventService.storeAll(userId, date, { source, ...actionParams });

        return res.sendStatus(StatusCodes.CREATED);
    }
}

module.exports = DataStoreController;
