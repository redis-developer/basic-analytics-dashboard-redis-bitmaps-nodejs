const dayjs = require('dayjs');

class PeriodService {
    constructor() {
        this.periods = [
            {
                from: '2015-12-01',
                to: '2015-12-07',
                name: 'dec_week_1'
            },
            {
                from: '2015-12-08',
                to: '2015-12-14',
                name: 'dec_week_2'
            },
            {
                from: '2015-12-15',
                to: '2015-12-21',
                name: 'dec_week_3'
            },
            {
                from: '2015-12-22',
                to: '2015-12-28',
                name: 'dec_week_4'
            },
            {
                from: '2015-12-29',
                to: '2015-12-31',
                name: 'dec_week_5'
            }
        ];
    }

    getPeriodByDate(date) {
        const period = this.periods.find(p => date === p.from || date === p.to || dayjs(date).isBetween(p.from, p.to));

        if (!period) {
            throw new Error();
        }

        return period.name;
    }
}

module.exports = PeriodService;
