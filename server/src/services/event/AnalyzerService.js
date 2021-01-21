const { BITMAP, COUNT, SET, SET_AND } = require('./types');

class AnalyzerService {
    constructor(redisService, keyGeneratorService) {
        this.redisService = redisService;
        this.keyGeneratorService = keyGeneratorService;
    }

    analyze(type, timeSpan, args) {
        const key = this.keyGeneratorService.generate({ type, timeSpan, ...args });

        switch (type) {
            case BITMAP:
                return this.redisService.countBit(key);

            case COUNT:
                return this.redisService.get(key).then(value => (value ? parseInt(value) : 0));

            case SET:
                return this.redisService.getSetValues(key);

            case SET_AND:
                return this.redisService.getSetIntersection(
                    this.keyGeneratorService.generate({
                        ...args.first,
                        type: SET,
                        timeSpan
                    }),
                    this.keyGeneratorService.generate({
                        ...args.second,
                        type: SET,
                        timeSpan
                    })
                );
        }
    }
}

module.exports = AnalyzerService;
