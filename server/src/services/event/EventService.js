const dayjs = require('dayjs');
const keyGenerator = require('./keyGenerator');
const { BITMAP, COUNT, SET } = require('./types');

class EventService {
    constructor(prefix, redisService, timeSpanService) {
        this.prefix = prefix;
        this.redisService = redisService;
        this.timeSpanService = timeSpanService;
    }

    storeBitmap(key, userId) {
        return this.redisService.setBit(key, userId, 1);
    }

    storeCount(key) {
        return this.redisService.increment(key);
    }

    storeSet(key, userId) {
        return this.redisService.addToSet(key, userId);
    }

    get scopes() {
        return [
            ({ source }) => {
                return { source };
            },

            ({ action }) => {
                return { action };
            },

            ({ source, action }) => {
                return { action, source };
            },

            ({ action, page }) => {
                return { action, page };
            },

            ({ userId, action }) => {
                return { userId, action };
            },

            () => {
                return { customName: 'global' };
            }
        ];
    }

    async storeAll(userId, date, args = {}) {
        const timeSpans = this.timeSpanService.all(dayjs(date));

        for (const timeSpan of timeSpans) {
            for (const scope of this.scopes) {
                const scopedArgs = scope({ ...args, userId });

                await this.storeCount(keyGenerator({ prefix: this.prefix, type: COUNT, timeSpan, ...scopedArgs }));

                if (scopedArgs.hasOwnProperty('userId')) {
                    continue;
                }

                await this.storeBitmap(
                    keyGenerator({ prefix: this.prefix, type: BITMAP, timeSpan, ...scopedArgs }),
                    userId
                );

                await this.storeSet(keyGenerator({ prefix: this.prefix, type: SET, timeSpan, ...scopedArgs }), userId);
            }
        }
    }

    async store(type, customName, userId, timeSpans = []) {
        for (const timeSpan of timeSpans) {
            const key = keyGenerator({ prefix: this.prefix, type, customName, timeSpan });

            switch (type) {
                case BITMAP:
                    await this.storeBitmap(key, userId);
                    break;
                case COUNT:
                    await this.storeCount(key);
                    break;
                case SET:
                    await this.storeSet(key, userId);
                    break;
            }
        }
    }
}

module.exports = EventService;
