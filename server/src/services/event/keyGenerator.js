module.exports = ({ prefix = 'analytics', type, customName, userId, source, action, page, timeSpan }) => {
    let key = '';

    if (prefix) {
        key += prefix;
    }

    if (type) {
        key += `:${type}`;
    }

    if (customName) {
        key += `:custom:${customName}`;
    }

    if (userId) {
        key += `:user:${userId}`;
    }

    if (source) {
        key += `:source:${source}`;
    }

    if (action) {
        key += `:action:${action}`;
    }

    if (page && action !== 'register') {
        key += `:page:${page}`;
    }

    if (timeSpan) {
        key += `:timeSpan:${timeSpan}`;
    }

    return key;
};
