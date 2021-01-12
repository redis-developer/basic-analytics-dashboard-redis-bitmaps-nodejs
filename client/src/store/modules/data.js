import axios from '@/plugins/axios';

const namespaced = true;

const state = () => ({
    refreshSignal: true
});

const getters = {
    refreshSignal: state => state.refreshSignal
};

const mutations = {
    NEGATE_REFRESH_SIGNAL: state => (state.refreshSignal = !state.refreshSignal)
};

const actions = {
    save(vuexContext, data) {
        return axios.post('/api/data', data);
    }
};

export default {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
