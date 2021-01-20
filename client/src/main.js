import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import Notifications from 'vue-notification';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/styles.scss';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(Notifications);

new Vue({
    vuetify: new Vuetify({}),
    router,
    store,
    render: h => h(App)
}).$mount('#app');
