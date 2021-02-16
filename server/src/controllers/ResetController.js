const { StatusCodes } = require('http-status-codes');

class ResetController {
    constructor(sampleDataService) {
        this.sampleDataService = sampleDataService;
    }

    async invoke(req, res) {
        await this.sampleDataService.generate();

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = ResetController;
