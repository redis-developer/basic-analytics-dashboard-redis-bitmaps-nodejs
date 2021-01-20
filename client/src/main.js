import Vue from 'vue';
import Notifications from 'vue-notification';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import './styles/styles.scss';

Vue.config.productionTip = false;

Vue.use(Notifications);

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app');
