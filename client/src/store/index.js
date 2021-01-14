import Vue from 'vue';
import Vuex from 'vuex';

import traffic from '@/store/modules/traffic';
import sales from '@/store/modules/sales';
import customers from '@/store/modules/customers';
import data from '@/store/modules/data';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: { traffic, sales, customers, data }
});
