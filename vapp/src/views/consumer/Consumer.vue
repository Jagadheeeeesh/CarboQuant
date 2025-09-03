<template>
  <div class="consumer-dashboard">
    <div class="dashboard-header" :style="{backgroundImage: `url(${image})`}">
      <div class="header-overlay">
        <div class="header-content">
          <h1 class="gradient-title">Welcome Consumer</h1>
          <p class="subtitle">Manage your carbon credits and trade in the marketplace</p>
          <div class="user-stats" v-if="user.loggedIn">
            <div class="stat-item">
              <i class="ri-leaf-line"></i>
              <span>{{ userCredits }} CCT</span>
            </div>
            <div class="stat-item">
              <i class="ri-exchange-line"></i>
              <span>{{ userTrades.length }} Trades</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Data Section -->
    <div class="dashboard-content">
      <div class="content-grid">
        <div class="main-content">
          <!-- Navigation Cards -->
          <div class="nav-cards">
            <router-link to="/consumer/consumer-profile" class="nav-card">
              <div class="card-icon">
                <i class="ri-user-line"></i>
              </div>
              <div class="card-content">
                <h3>Consumer Profile</h3>
                <p>View and manage your profile information</p>
              </div>
              <div class="card-arrow">
                <i class="ri-arrow-right-line"></i>
              </div>
            </router-link>

            <router-link to="/consumer/consumer-market" class="nav-card">
              <div class="card-icon">
                <i class="ri-store-line"></i>
              </div>
              <div class="card-content">
                <h3>Consumer Market</h3>
                <p>Buy and sell carbon credits</p>
              </div>
              <div class="card-arrow">
                <i class="ri-arrow-right-line"></i>
              </div>
            </router-link>
          </div>

          <!-- Trading Interface -->
          <TradingInterface />
          
          <!-- Input Value Form -->
          <InputValueForm />
        </div>

        <div class="sidebar-content">
          <!-- Live Market Data -->
          <LiveMarketData />
          
          <!-- Live Price Tracker -->
          <LivePriceTracker />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import con from "@/assets/consumer.jpg";
import LiveMarketData from "../../components/LiveMarketData.vue";
import LivePriceTracker from "../../components/LivePriceTracker.vue";
import TradingInterface from "../../components/TradingInterface.vue";
import InputValueForm from "../../components/InputValueForm.vue";

export default {
  name: 'Consumer',
  components: {
    LiveMarketData,
    LivePriceTracker,
    TradingInterface,
    InputValueForm
  },
  data() {
    return {
      image: con,
      userTrades: []
    };
  },
  computed: {
    ...mapGetters(['user', 'userCredits'])
  },
  async mounted() {
    if (this.user.loggedIn) {
      await this.loadUserData();
    }
  },
  methods: {
    async loadUserData() {
      try {
        // Load user trades
        this.userTrades = await this.$firebaseService.getUserTrades(this.user.data.uid);
        
        // Load user credits
        const credits = await this.$firebaseService.getUserCredits(this.user.data.uid);
        this.$store.dispatch('updateUserCredits', credits);
        
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }
};
</script>

<style scoped>
.consumer-dashboard {
  min-height: calc(100vh - 180px);
}

.dashboard-header {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 100, 0, 0.3));
  display: flex;
  align-items: center;
}

.header-content {
  padding: 0 2rem;
  color: white;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.gradient-title {
  margin: 0 0 1rem 0;
  font-size: 3.5rem;
  font-family: 'Syne', sans-serif;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-sm);
  backdrop-filter: blur(10px);
  font-weight: 600;
}

.stat-item i {
  font-size: 1.25rem;
  color: var(--accent-primary);
}

.dashboard-content {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.nav-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-accent);
  border-color: var(--accent-primary);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.card-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.card-arrow {
  color: var(--accent-primary);
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.nav-card:hover .card-arrow {
  transform: translateX(4px);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    height: 250px;
  }
  
  .gradient-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .user-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
  
  .nav-cards {
    gap: 1rem;
  }
  
  .nav-card {
    padding: 1.5rem;
  }
}
</style>