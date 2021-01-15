const dayjs = require('dayjs');

module.exports = {
    year(date) {
        return date.year();
    },

    month(date) {
        return `${date.year()}-${(date.month() + 1).toString().padStart(2, '0')}`;
    },

    day(date) {
        return date.format('YYYY-MM-DD');
    },

    weekOfMonth(date) {
        const week = Math.ceil(date.date() / 7);

        return `${this.month(date)}/${week}`;
    }
};
