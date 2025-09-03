import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        user: {
            loggedIn: false,
            data: null,
            profile: null
        },
        market: {
            carbonPrice: 0,
            priceChange: 0,
            volume24h: 0,
            marketCap: 0,
            totalSupply: 0
        },
        prices: {
            carbon: {
                price: 0,
                change: 0
            }
        },
        trades: [],
        notifications: [],
        credits: 0
    },
    getters: {
        user(state) {
            return state.user;
        },
        market(state) {
            return state.market;
        },
        prices(state) {
            return state.prices;
        },
        trades(state) {
            return state.trades;
        },
        notifications(state) {
            return state.notifications;
        },
        unreadNotifications(state) {
            return state.notifications.filter(n => !n.read);
        },
        userCredits(state) {
            return state.credits;
        }
    },
    mutations: {
        SET_LOGGED_IN(state, value) {
            state.user.loggedIn = value;
        },
        SET_USER(state, data) {
            state.user.data = data;
        },
        SET_USER_PROFILE(state, profile) {
            state.user.profile = profile;
        },
        SET_MARKET_DATA(state, data) {
            state.market = { ...state.market, ...data };
        },
        SET_PRICES(state, prices) {
            state.prices = { ...state.prices, ...prices };
        },
        SET_TRADES(state, trades) {
            state.trades = trades;
        },
        ADD_TRADE(state, trade) {
            state.trades.unshift(trade);
        },
        SET_NOTIFICATIONS(state, notifications) {
            state.notifications = notifications;
        },
        ADD_NOTIFICATION(state, notification) {
            state.notifications.unshift(notification);
        },
        MARK_NOTIFICATION_READ(state, notificationId) {
            const notification = state.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
            }
        },
        SET_USER_CREDITS(state, credits) {
            state.credits = credits;
        }
    },
    actions: {
        fetchUser({commit}, user) {
            commit("SET_LOGGED_IN", user !== null);
            if (user) {
                commit("SET_USER", {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email
                });
            } else {
                commit("SET_USER", null);
                commit("SET_USER_PROFILE", null);
            }
        },
        setUserProfile({commit}, profile) {
            commit("SET_USER_PROFILE", profile);
        },
        updateMarketData({commit}, data) {
            commit("SET_MARKET_DATA", data);
        },
        updatePrices({commit}, prices) {
            commit("SET_PRICES", prices);
        },
        updateTrades({commit}, trades) {
            commit("SET_TRADES", trades);
        },
        addTrade({commit}, trade) {
            commit("ADD_TRADE", trade);
        },
        updateNotifications({commit}, notifications) {
            commit("SET_NOTIFICATIONS", notifications);
        },
        addNotification({commit}, notification) {
            commit("ADD_NOTIFICATION", notification);
        },
        markNotificationRead({commit}, notificationId) {
            commit("MARK_NOTIFICATION_READ", notificationId);
        },
        updateUserCredits({commit}, credits) {
            commit("SET_USER_CREDITS", credits);
        }
    }
});

export default store;