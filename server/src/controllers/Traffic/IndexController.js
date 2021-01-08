const dayjs = require('dayjs');
const faker = require('faker');
const { StatusCodes } = require('http-status-codes');

const makeFakeData = numberOfEntries => {
    const entries = [];

    for (let i = 0; i < numberOfEntries; i++) {
        entries.push({
            page: faker.random.arrayElement(['homepage', 'product1page', 'product2page', 'product3page']),
            source: faker.random.arrayElement(['google', 'email', 'direct', 'referral', 'facebook', 'none']),
            date: dayjs(faker.date.between('2015-12-01', '2015-12-31')).format('YYYY-MM-DD')
        });
    }

    return entries;
};

const testData = makeFakeData(500);

class TrafficIndexController {
    async invoke(req, res) {
        const { filter } = req.query;

        try {
            const { between = null } = filter ? JSON.parse(filter) : {};

            const data =
                between && typeof between === 'object' && between.from && between.to
                    ? testData.filter(
                          data =>
                              data.date === between.from ||
                              data.date === between.to ||
                              dayjs(data.date).isBetween(between.from, between.to, 'day')
                      )
                    : testData;

            return res.send(data);
        } catch (err) {
            if (err instanceof SyntaxError) {
                return res.sendStatus(StatusCodes.BAD_REQUEST);
            }

            console.error(err);

            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = TrafficIndexController;
