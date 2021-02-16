const { StatusCodes } = require('http-status-codes');

class DataStoreController {
    constructor(storeDataService) {
        this.storeDataService = storeDataService;
    }

    async invoke(req, res) {
        await this.storeDataService.store(req.body);

        return res.sendStatus(StatusCodes.CREATED);
    }
}

module.exports = DataStoreController;
