class KeyGeneratorService {
    constructor(prefix) {
        this.prefix = prefix || 'analytics';
    }

    generate({ type, customName, userId, source, action, page, timeSpan }) {
        let key = this.prefix;

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
    }
}

module.exports = KeyGeneratorService;
