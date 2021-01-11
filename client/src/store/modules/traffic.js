import axios from '@/plugins/axios';

const namespaced = true;

const state = () => ({});

const getters = {};

const mutations = {};

const actions = {
    async fetch(vuexContext, params) {
        const { data } = await axios.get('/traffic', { params });

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
