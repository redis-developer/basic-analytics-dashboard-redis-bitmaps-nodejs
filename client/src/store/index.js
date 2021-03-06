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
        refreshSignal: true,
        period: null,
        redisLoading: false
    }),

    getters: {
        refreshSignal: state => state.refreshSignal,
        getPeriod: state => state.period,
        getRedisLoading: state => state.redisLoading
    },

    mutations: {
        NEGATE_REFRESH_SIGNAL: state => (state.refreshSignal = !state.refreshSignal),
        SET_PERIOD: (state, period) => (state.period = period),
        SET_REDIS_LOADING: (state, loading) => (state.redisLoading = loading)
    },

    actions: {
        async flush() {
            await axios.delete('/api/flush');
        },

        async reset() {
            await axios.post('/api/reset');
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

        updatePeriod({ commit }, period) {
            commit('SET_PERIOD', period);
        },

        saveData(vuexContext, data) {
            return axios.post('/api/data', data);
        }
    }
});
