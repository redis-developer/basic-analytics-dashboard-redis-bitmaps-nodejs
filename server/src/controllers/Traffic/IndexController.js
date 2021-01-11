const { StatusCodes } = require('http-status-codes');

class TrafficIndexController {
    constructor(redisService, periodService) {
        this.redisService = redisService;
        this.periodService = periodService;
    }

    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const { period = null, search = null, type = 'source' } = filter ? JSON.parse(filter) : {};

            if (search && Array.isArray(search)) {
                const totals = {};

                for (const item of search) {
                    totals[`${item}Traffic`] = await this._search(period, item, type);
                }

                return res.send(totals);
            }

            const totalTraffic = await this._search(period, search, type);

            return res.send({ totalTraffic });
        } catch (err) {
            if (err instanceof SyntaxError) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }

            console.error(err);

            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async _search(period, search, type) {
        if (period instanceof Object && Array.isArray(period)) {
            const results = {};

            for (const p of period) {
                results[p] = await this._search(p, search, type);
            }

            return results;
        }

        const periods = period ? [period] : ['dec_week_1', 'dec_week_2', 'dec_week_3', 'dec_week_4', 'dec_week_5'];

        const searches = search ? [search] : ['google', 'facebook', 'email', 'direct', 'referral', 'none'];

        const prefix = type === 'page' ? 'traffic_per_page' : 'traffic_per_source';

        const keys = [];

        searches.forEach(_search => {
            const _key = `${prefix}:${_search}`;

            periods.forEach(period => keys.push(`${_key}:${period}`));
        });

        const total = await this.redisService.calculateOr(keys);

        return total;
    }
}

module.exports = TrafficIndexController;
