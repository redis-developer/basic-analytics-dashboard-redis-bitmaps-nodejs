class PeriodService {
    getRangeOfDates(start, end, key, arr = []) {
        if (start.isAfter(end)) {
            throw new Error('start must precede end');
        }

        const next = start.add(1, key).startOf(key);

        if (next.isAfter(end, key)) {
            return arr;
        }

        return this.getRangeOfDates(next, end, key, arr.concat(next));
    }
}

module.exports = PeriodService;
