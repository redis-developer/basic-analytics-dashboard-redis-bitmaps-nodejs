const { BITMAP, COUNT, SET } = require('./types');

class EventService {
    constructor(redisService, timeSpanService, keyGeneratorService) {
        this.redisService = redisService;
        this.timeSpanService = timeSpanService;
        this.keyGeneratorService = keyGeneratorService;
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
        const timeSpans = this.timeSpanService.all(date);

        for (const timeSpan of timeSpans) {
            for (const scope of this.scopes) {
                const scopedArgs = scope({ ...args, userId });

                await this.storeCount(this.keyGeneratorService.generate({ type: COUNT, timeSpan, ...scopedArgs }));

                if (scopedArgs.hasOwnProperty('userId')) {
                    continue;
                }

                await this.storeBitmap(
                    this.keyGeneratorService.generate({ type: BITMAP, timeSpan, ...scopedArgs }),
                    userId
                );

                await this.storeSet(this.keyGeneratorService.generate({ type: SET, timeSpan, ...scopedArgs }), userId);
            }
        }
    }

    async store(type, customName, userId, timeSpans = []) {
        for (const timeSpan of timeSpans) {
            const key = this.keyGeneratorService.generate({ type, customName, timeSpan });

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
