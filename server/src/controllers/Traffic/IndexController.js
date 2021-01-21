const { BITMAP } = require('../../services/event/types');

class TrafficIndexController {
    constructor(analyzerService) {
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { filter, period = '2015-12' } = req.query;

        const defaultFilter = {
            sources: ['facebook', 'google', 'direct', 'email', 'referral', 'none'],
            pages: ['homepage', 'product1', 'product2', 'product3'],
            total: true
        };

        const { sources = [], pages = [], total = false } = filter ? JSON.parse(filter) : defaultFilter;

        const results = [];

        if (total) {
            const count = await this.analyzerService.analyze(BITMAP, period, { customName: 'global' });

            results.push({
                count,
                type: 'total'
            });
        }

        for (const source of sources) {
            const count = await this.analyzerService.analyze(BITMAP, period, { source });

            results.push({
                count,
                type: 'source',
                value: source
            });
        }

        for (const page of pages) {
            const count = await this.analyzerService.analyze(BITMAP, period, {
                action: 'visit',
                page
            });

            results.push({
                count,
                type: 'page',
                value: page
            });
        }

        return res.send(results);
    }
}

module.exports = TrafficIndexController;
