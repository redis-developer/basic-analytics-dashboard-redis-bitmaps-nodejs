class TimeSpanService {
    constructor(dayjs) {
        this.dayjs = dayjs;
    }

    year(date) {
        const _date = this.dayjs(date);

        return _date.year();
    }

    month(date) {
        const _date = this.dayjs(date);

        return `${_date.year()}-${(_date.month() + 1).toString().padStart(2, '0')}`;
    }

    day(date) {
        const _date = this.dayjs(date);

        return _date.format('YYYY-MM-DD');
    }

    weekOfMonth(date) {
        const _date = this.dayjs(date);

        const week = Math.ceil(_date.date() / 7);

        return `${this.month(date)}/${week}`;
    }

    anytime() {
        return 'anytime';
    }

    all(date) {
        return [this.year(date), this.month(date), this.day(date), this.weekOfMonth(date), this.anytime()];
    }
}

module.exports = TimeSpanService;
