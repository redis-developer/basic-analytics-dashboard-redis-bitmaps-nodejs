class PeriodService {
    constructor(dayjs) {
        this.dayjs = dayjs;
    }

    getRangeOfDates(start, end, key, arr = []) {
        const _start = this.dayjs(start);

        if (!arr.length) {
            arr.push(_start);
        }

        if (_start.isAfter(end)) {
            throw new Error('start must precede end');
        }

        const next = _start.add(1, key).startOf(key);

        if (next.isAfter(end, key)) {
            return arr;
        }

        return this.getRangeOfDates(next, end, key, arr.concat(next));
    }
}

module.exports = PeriodService;
