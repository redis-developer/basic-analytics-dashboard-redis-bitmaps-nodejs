const fs = require('fs');
const path = require('path');
const faker = require('faker');
const di = require('../di');

const periodService = di.get('services.period');

const samplePath = path.join(__dirname, '..', 'sample.json');

const actionHelpers = {
    visit: (data, date, source, userId, page) => {
        data.push({ date, source, userId, actionParams: { action: 'visit', page } });
    },

    register: (data, date, source, userId) => {
        data.push({ date, source, userId, actionParams: { action: 'register' } });
    },

    addToCart: (data, date, source, userId, page) => {
        data.push({ date, source, userId, actionParams: { action: 'addToCart', page } });
    },

    registerAndBuy: (data, date, source, userId, page) => {
        actionHelpers.register(data, date, source, userId);

        actionHelpers.addToCart(data, date, source, userId, page);

        data.push({ date, source, userId, actionParams: { action: 'buy', page } });
    },

    getPage: action => {
        if (action === 'register') {
            return;
        }

        if (action === 'visit') {
            return faker.random.arrayElement(['product1', 'product2', 'product3', 'homepage']);
        }

        return faker.random.arrayElement(['product1', 'product2', 'product3']);
    }
};

const actions = ['visit', 'register', 'addToCart', 'registerAndBuy'];

const dates = periodService.getRangeOfDates('2015-12-01', '2015-12-31', 'day').map(date => date.format('YYYY-MM-DD'));

const sources = ['google', 'facebook', 'email', 'direct', 'referral', 'none'];

const users = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const maxUsersPerDay = 8;

const data = [];

for (const date of dates) {
    const _users = faker.random.arrayElements(users, faker.random.number(maxUsersPerDay - 1) + 1);

    for (const userId of _users) {
        const action = faker.random.arrayElement(actions);
        const source = faker.random.arrayElement(sources);
        const page = actionHelpers.getPage(action);

        actionHelpers[action](data, date, source, userId, page);
    }
}

fs.writeFileSync(samplePath, JSON.stringify(data, null, 4).concat('\n'));
