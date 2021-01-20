const { SET } = require('../../services/event/types');

class CustomersRetentionShowController {
    constructor(analyzerService) {
        this.analyzerService = analyzerService;
    }

    async invoke(req, res) {
        const { period = '2015-12' } = req.query;

        const users = await this.analyzerService
            .analyze(SET, period, { customName: 'retention-buy' })
            .then(usersIds => usersIds.map(userId => `User${parseInt(userId) + 1}`));

        return res.send(users);
    }
}

module.exports = CustomersRetentionShowController;
