class TimeSpanService {
    year(date) {
        return date.year();
    }

    month(date) {
        return `${date.year()}-${(date.month() + 1).toString().padStart(2, '0')}`;
    }

    day(date) {
        return date.format('YYYY-MM-DD');
    }

    weekOfMonth(date) {
        const week = Math.ceil(date.date() / 7);

        return `${this.month(date)}/${week}`;
    }

    anytime() {
        return 'anytime';
    }

    toArray() {
        return [this.year, this.month, this.day, this.weekOfMonth.bind(this), this.anytime];
    }

    all(date) {
        return [this.year(date), this.month(date), this.day(date), this.weekOfMonth(date), this.anytime()];
    }
}

module.exports = TimeSpanService;
