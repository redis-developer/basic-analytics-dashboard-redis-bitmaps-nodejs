const { StatusCodes } = require('http-status-codes');

class AdminClearRedisController {
    constructor(redisService) {
        this.redisService = redisService;
    }

    async invoke(req, res) {
        await this.redisService.flush();

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = AdminClearRedisController;
