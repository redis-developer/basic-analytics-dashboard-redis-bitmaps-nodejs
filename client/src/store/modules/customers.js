import axios from '@/plugins/axios';

const namespaced = true;

const state = () => ({});

const getters = {};

const mutations = {};

const actions = {
    async fetchCohort(vuexContext, params) {
        const { data } = await axios.get('/api/customers/cohort', { params });

        return data;
    },

    async fetchProducts(vuexContext, params) {
        const { data } = await axios.get('/api/customers/products', { params });

        return data;
    },

    async fetchRetention(vuexContext, params) {
        const { data } = await axios.get('/api/customers/retention', { params });

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
