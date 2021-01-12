const dayjs = require('dayjs');
const { StatusCodes } = require('http-status-codes');

class TrafficIndexController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
        this.periodService = periodService;
    }

    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const { period = null, search = null, type = 'source', trend = false } = filter ? JSON.parse(filter) : {};

            if (search && Array.isArray(search)) {
                const totals = {};

                for (const item of search) {
                    totals[`${item}Traffic`] = await this._search(period, item, type, trend);
                }

                return res.send(totals);
            }

            const totalTraffic = await this._search(period, search, type, trend);

            return res.send({ totalTraffic });
        } catch (err) {
            if (err instanceof SyntaxError) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }

            console.error(err);

            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async _search(period, search, type, trend) {
        const dates =
            period && typeof period === 'object' && period.from && period.to
                ? this.periodService.getRangeOfDates(dayjs(period.from), period.to, 'day', [dayjs(period.from)])
                : this.periodService.getRangeOfDates(dayjs('2015-12-01'), '2015-12-31', 'day', [dayjs('2015-12-01')]);

        const searches = search ? [search] : ['google', 'facebook', 'email', 'direct', 'referral', 'none'];

        const prefix = type === 'page' ? 'traffic_per_page' : 'traffic_per_source';

        const keys = [];

        const _trend = {};

        for (const _search of searches) {
            const _key = `${prefix}:${_search}`;

            for (const date of dates) {
                const formatedDate = date.format('YYYY-MM-DD');

                const key = `${_key}:${formatedDate}`;

                if (trend) {
                    _trend[formatedDate] = await this.redisService.count(key);
                }

                keys.push(key);
            }
        }

        if (keys.length === 0) {
            return 0;
        }

        const total = await this.redisService.calculateUniques(keys);

        const result = trend ? { total, trend: _trend } : total;

        return result;
    }
}

module.exports = TrafficIndexController;
