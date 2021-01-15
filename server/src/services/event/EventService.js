const dayjs = require('dayjs');
const timeSpans = require('./timeSpans');
const scopes = require('./scopes');

class EventService {
    constructor(prefix, redisService) {
        this.prefix = prefix;
        this.redisService = redisService;
    }

    get stores() {
        const redisService = this.redisService;

        return [
            function (prefix, key, userId) {
                return redisService.setBit(`${prefix}:bitmap:${key}`, userId, 1);
            },

            async function (prefix, key) {
                return redisService.increment(`${prefix}:increment:${key}`);
            },

            async function (prefix, key, userId) {
                return redisService.addToSet(`${prefix}:set:${key}`, userId);
            }
        ];
    }

    async store(userId, date, args = {}) {
        const keys = Object.keys(timeSpans).flatMap(timeSpansKey => {
            const timeSpan = timeSpans[timeSpansKey].bind(timeSpans);

            return Object.keys(scopes).flatMap(scopesKey => {
                const scope = scopes[scopesKey](args);

                if (!scope) {
                    return [];
                }

                const scopeName = scope !== scopesKey ? `:${scope}` : '';

                return `${scopesKey}${scopeName}:${timeSpansKey}:${timeSpan(dayjs(date))}`;
            });
        });

        for (const key of keys) {
            for (const store of this.stores) {
                await store(this.prefix, key, userId);
            }
        }
    }
}

module.exports = EventService;
