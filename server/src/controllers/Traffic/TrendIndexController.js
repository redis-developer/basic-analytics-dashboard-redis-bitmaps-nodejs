const { StatusCodes } = require('http-status-codes');
const dayjs = require('dayjs');
const { BITMAP } = require('../../services/event/types');

class TrafficTrendIndexController {
    constructor(periodService, analyzerService) {
        this.periodService = periodService;
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { filter, period } = req.query;

        const defaultFilter = {
            sources: ['facebook', 'google', 'direct', 'email', 'referral', 'none'],
            pages: ['homepage', 'product1', 'product2', 'product3']
        };

        const defaultPeriod = { from: '2015-12-01', to: '2015-12-31' };

        const { sources = [], pages = [] } = filter ? JSON.parse(filter) : defaultFilter;

        const { from = '2015-12-01', to = '2015-12-31' } = period ? JSON.parse(period) : defaultPeriod;

        const dates = this.periodService.getRangeOfDates(dayjs(from), to, 'day', [dayjs(from)]);

        const results = [];

        for (const date of dates) {
            const dateFormatted = date.format('YYYY-MM-DD');

            for (const source of sources) {
                const count = await this.analyzerService.analyze(BITMAP, dateFormatted, {
                    source
                });

                results.push({
                    count,
                    date: dateFormatted,
                    type: 'source',
                    value: source
                });
            }

            for (const page of pages) {
                const count = await this.analyzerService.analyze(BITMAP, dateFormatted, {
                    action: 'visit',
                    page
                });

                results.push({
                    count,
                    date: dateFormatted,
                    type: 'page',
                    value: page
                });
            }
        }

        return res.send(results);
    }
}

module.exports = TrafficTrendIndexController;
