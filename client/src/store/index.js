import Vue from 'vue';
import Vuex from 'vuex';

import traffic from '@/store/modules/traffic';
import data from '@/store/modules/data';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: { traffic, data }
});
