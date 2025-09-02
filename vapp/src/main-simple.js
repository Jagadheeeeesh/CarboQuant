import Vue from 'vue';
import 'regenerator-runtime/runtime';
import App from './App.vue';
import firebase from "firebase";
import store from "./store";
import routes from "./routes.js";
import VueRouter from "vue-router";
import Toasted from 'vue-toasted';
import BootstrapVue from "bootstrap-vue";
import Web3 from 'web3';

// Import CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(Toasted);
Vue.use(BootstrapVue);
Vue.use(VueRouter);

Vue.config.productionTip = false;

// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8FLGJNqsEMOwO30ndAQ9qJOFSYfgqVzw",
    authDomain: "is4302-app.firebaseapp.com",
    databaseURL: "https://is4302-app-default-rtdb.firebaseio.com",
    projectId: "is4302-app",
    storageBucket: "is4302-app.appspot.com",
    messagingSenderId: "455622780080",
    appId: "1:455622780080:web:0bd1c184210a5c70634775",
    measurementId: "G-1F2J8YSJXJ"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(user => {
    store.dispatch("fetchUser", user);
});    // Web3 setup
if (typeof window.ethereum !== 'undefined') {
    Vue.prototype.$web3 = new Web3(window.ethereum);
} else {
    // Fallback to local development node
    Vue.prototype.$web3 = new Web3('http://127.0.0.1:7545');
}

// Contract addresses from deployment
Vue.prototype.$contractAddresses = {
    CarbonCredit: '0x87a008BD01D09c6656b96Ca24033240CE2ea07c5',
    MarketPlace: '0x205cB522593014B785916188688F05356932eD79'
};

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
