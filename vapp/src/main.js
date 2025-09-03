import Vue from 'vue';
import App from './App.vue';
import store from "./store";
import routes from "./routes.js";
import VueRouter from "vue-router";
import Toasted from 'vue-toasted';
import BootstrapVue from "bootstrap-vue";
import ContractService from './services/ContractService';
import FirebaseService from './services/FirebaseService';

// Import CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(Toasted);
Vue.use(BootstrapVue);
Vue.use(VueRouter);

Vue.config.productionTip = false;

// Make ContractService and FirebaseService available globally
Vue.prototype.$contractService = ContractService;
Vue.prototype.$firebaseService = FirebaseService;

// Initialize Firebase authentication state listener
FirebaseService.onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
});

// Initialize sample data on app start
FirebaseService.initializeSampleData();

// router
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

new Vue({
    render: h => h(App),
    router: router,
    store: store
}).$mount('#app');