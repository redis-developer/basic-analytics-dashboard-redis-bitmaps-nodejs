const { StatusCodes } = require('http-status-codes');

module.exports = (err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.sendStatus(StatusCodes.BAD_REQUEST);
    }

    console.error(err);

    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};
