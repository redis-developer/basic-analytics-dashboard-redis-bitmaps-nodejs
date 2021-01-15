module.exports = {
    source: ({ source }) => {
        return source;
    },

    action: ({ action }) => {
        return action;
    },

    actionPage: ({ action, page }) => {
        if (action === 'register') {
            return null;
        }

        return `${action}:${page}`;
    },

    sourceAction: ({ source, action }) => {
        return `${source}:${action}`;
    },

    global: () => {
        return 'global';
    }
};
