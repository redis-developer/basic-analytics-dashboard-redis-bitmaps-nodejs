import Vue from 'vue';
import Vuex from 'vuex';

import traffic from '@/store/modules/traffic';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: { traffic }
});
