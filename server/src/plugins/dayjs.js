const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');

module.exports = () => {
    dayjs.extend(isBetween);
};
