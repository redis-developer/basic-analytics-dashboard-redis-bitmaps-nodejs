import Vue from 'vue';
import Vuex from 'vuex';
import globalAxios from 'axios';

import { apiUrl } from '@/config';

const axios = globalAxios.create({
    baseURL: apiUrl
});

Vue.use(Vuex);

export default new Vuex.Store({
    state: () => ({
        refreshSignal: true
    }),

    getters: {
        refreshSignal: state => state.refreshSignal
    },

    mutations: {
        NEGATE_REFRESH_SIGNAL: state => (state.refreshSignal = !state.refreshSignal)
    },

    actions: {
        async flush() {
            await axios.delete('/api/flush');
        },

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
        },

        async fetchSales(vuexContext, params) {
            const { data } = await axios.get('/api/sales', { params });

            return data;
        },

        async fetchTraffic(vuexContext, params) {
            const { data } = await axios.get('/api/traffic', { params });

            return data;
        },

        async fetchTrend(vuexContext, params) {
            const { data } = await axios.get('/api/traffic/trend', { params });

            return data;
        },

        saveData(vuexContext, data) {
            return axios.post('/api/data', data);
        }
    }
});
