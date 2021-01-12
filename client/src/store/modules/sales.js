import axios from '@/plugins/axios';

const namespaced = true;

const state = () => ({});

const getters = {};

const mutations = {};

const actions = {
    async fetch(vuexContext, params) {
        const { data } = await axios.get('/api/sales', { params });

        return data;
    }
};

export default {
    namespaced,
    state,
    getters,
    mutations,
    actions
};
