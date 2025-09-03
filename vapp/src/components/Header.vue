<template>
  <header class="header">
    <nav class="nav-container">
      <div class="brand">
        <router-link to="/" class="brand-link">
          <i class="ri-leaf-line"></i>
          <span>CarboQuant</span>
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link to="/regulator" class="nav-item">
          <i class="ri-shield-keyhole-line"></i>
          <span>Regulator</span>
        </router-link>
        <router-link to="/validator" class="nav-item">
          <i class="ri-checkbox-circle-line"></i>
          <span>Validator</span>
        </router-link>
        <router-link to="/generator" class="nav-item">
          <i class="ri-battery-charge-line"></i>
          <span>Generator</span>
        </router-link>
        <router-link to="/consumer" class="nav-item">
          <i class="ri-user-heart-line"></i>
          <span>Consumer</span>
        </router-link>
      </div>

      <div class="user-menu">
        <template v-if="user.loggedIn">
          <div class="live-data-preview">
            <div class="price-ticker">
              <i class="ri-line-chart-line"></i>
              <span class="price">${{ currentPrice.toFixed(2) }}</span>
              <span class="change" :class="priceChangeClass">
                {{ priceChange > 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
              </span>
            </div>
          </div>
          
          <NotificationCenter />
          
          <div class="user-profile">
            <div class="user-info">
              <span class="user-name">{{ user.data.displayName || user.data.email }}</span>
              <span class="user-role" v-if="user.profile">{{ user.profile.role }}</span>
            </div>
            <button @click="signOut" class="btn-logout">
              <i class="ri-logout-box-r-line"></i>
            </button>
          </div>
        </template>
        <router-link v-else to="login" class="btn-login">
          <i class="ri-login-circle-line"></i>
          <span>Login</span>
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import NotificationCenter from "./NotificationCenter.vue";

export default {
  components: {
    NotificationCenter
  },
  computed: {
    ...mapGetters({
      user: "user",
      prices: "prices"
    }),
    currentPrice() {
      return this.prices.carbon?.price || 85.50;
    },
    priceChange() {
      return this.prices.carbon?.change || 0;
    },
    priceChangeClass() {
      return {
        'positive': this.priceChange > 0,
        'negative': this.priceChange < 0
      };
    }
  },
  methods: {
    async signOut() {
      try {
        await this.$firebaseService.signOut();
        this.$router.replace({ path: "/" });
      } catch (error) {
        console.error('Error signing out:', error);
        this.$toasted.show('Error signing out', {
          type: 'error',
          duration: 3000
        });
      }
    }
  }
};
</script>

<style scoped>
.header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--accent-primary);
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-link i {
  font-size: 1.75rem;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
}

.nav-item:hover {
  color: var(--accent-primary);
  background: var(--glass-bg);
}

.nav-item i {
  font-size: 1.25rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.live-data-preview {
  display: flex;
  align-items: center;
}

.price-ticker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
}

.price-ticker i {
  color: var(--accent-primary);
}

.price {
  font-weight: 600;
  color: var(--text-primary);
}

.change {
  font-weight: 600;
  font-size: 0.8rem;
}

.change.positive {
  color: #4CAF50;
}

.change.negative {
  color: #F44336;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.user-role {
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: capitalize;
}

.btn-logout {
  background: none;
  border: none;
  color: var(--accent-error);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  border-radius: 50%;
}

.btn-logout:hover {
  background: rgba(var(--accent-error-rgb), 0.1);
  transform: translateY(-1px);
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  padding: 0.5rem 1.25rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: var(--glow-accent);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-container {
    padding: 0.75rem;
  }
  
  .live-data-preview,
  .user-info {
    display: none;
  }
  
  .user-menu {
    gap: 0.5rem;
  }
}
</style>