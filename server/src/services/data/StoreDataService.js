const { COUNT, SET, BITMAP } = require('../event/types');

class StoreDataService {
    constructor(eventService, analyzerService, timeSpanService) {
        this.eventService = eventService;
        this.analyzerService = analyzerService;
        this.timeSpanService = timeSpanService;
    }

    async store({ userId, date, actionParams, source }) {
        if (actionParams.action === 'buy') {
            const monthRegisterCount = await this.analyzerService.analyze(COUNT, this.timeSpanService.month(date), {
                action: 'register',
                userId
            });

            const todayBuyCount = await this.analyzerService.analyze(COUNT, this.timeSpanService.day(date), {
                action: 'buy',
                userId
            });

            const anytimeBuyCount = await this.analyzerService.analyze(COUNT, this.timeSpanService.anytime(), {
                action: 'buy',
                userId
            });

            if (anytimeBuyCount > todayBuyCount) {
                await this.eventService.store(SET, 'retention-buy', userId, this.timeSpanService.all(date));
            }

            if (monthRegisterCount > 0) {
                await this.eventService.store(BITMAP, 'cohort-buy', userId, this.timeSpanService.all(date));
            }
        }

        await this.eventService.storeAll(userId, date, { source, ...actionParams });
    }
}

module.exports = StoreDataService;
