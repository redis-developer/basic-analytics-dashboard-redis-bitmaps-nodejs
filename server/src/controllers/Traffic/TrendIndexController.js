const { StatusCodes } = require('http-status-codes');
const dayjs = require('dayjs');
const { BITMAP } = require('../../services/event/types');

class TrafficTrendIndexController {
    constructor(redisService, periodService, analyzerService) {
        this.redisService = redisService;
        this.periodService = periodService;
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { filter, period } = req.query;

        try {
            const { sources = [], pages = [] } = filter
                ? JSON.parse(filter)
                : {
                      sources: ['facebook', 'google', 'direct', 'email', 'referral', 'none'],
                      pages: ['homepage', 'product1', 'product2', 'product3']
                  };

            const { from = '2015-12-01', to = '2015-12-31' } = period
                ? JSON.parse(period)
                : { from: '2015-12-01', to: '2015-12-31' };

            const dates = this.periodService.getRangeOfDates(dayjs(from), to, 'day', [dayjs(from)]);

            const results = [];

            for (const date of dates) {
                const _date = date.format('YYYY-MM-DD');

                for (const source of sources) {
                    const count = await this.analyzerService.analyze(BITMAP, _date, {
                        source
                    });

                    results.push({
                        count,
                        date: _date,
                        type: 'source',
                        value: source
                    });
                }

                for (const page of pages) {
                    const count = await this.analyzerService.analyze(BITMAP, _date, {
                        action: 'visit',
                        page
                    });

                    results.push({
                        count,
                        date: _date,
                        type: 'page',
                        value: page
                    });
                }
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

module.exports = TrafficTrendIndexController;
