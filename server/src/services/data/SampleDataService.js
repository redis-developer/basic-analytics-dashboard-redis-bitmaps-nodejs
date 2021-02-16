class SampleDataService {
    constructor(storeDataService, redisService) {
        this.storeDataService = storeDataService;
        this.redisService = redisService;
    }

    async generate() {
        try {
            await this.redisService.flush();

            const events = require('../../sample.json');

            for (const event of events) {
                await this.storeDataService.store(event);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = SampleDataService;
