<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Welcome to<br />
          <span class="gradient-text">CarboQuant</span>
        </h1>
        <p class="hero-subtitle">
          The next generation platform for carbon credit trading,
          powered by blockchain technology and real-time Firebase data
        </p>
        <div class="hero-actions">
          <router-link to="/login" class="btn-primary">
            Get Started
            <i class="ri-arrow-right-line"></i>
          </router-link>
          <a href="#live-data" class="btn-secondary">
            Live Market
            <i class="ri-line-chart-line"></i>
          </a>
        </div>
      </div>
    </div>

    <div id="live-data" class="live-data-section">
      <div class="section-container">
        <h2 class="section-title">Live Market Data</h2>
        <div class="live-components">
          <LiveMarketData />
          <LivePriceTracker />
        </div>
      </div>
    </div>

    <div id="learn-more" class="features-section">
      <h2 class="section-title">How It Works</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="ri-shield-check-line"></i>
          <h3>Secure Trading</h3>
          <p>Trade carbon credits with confidence using blockchain technology</p>
        </div>

        <div class="feature-card">
          <i class="ri-flow-chart"></i>
          <h3>Transparent Process</h3>
          <p>Track every transaction and verify credit authenticity</p>
        </div>

        <div class="feature-card">
          <i class="ri-line-chart-line"></i>
          <h3>Real-time Analytics</h3>
          <p>Monitor market trends and trading activities instantly</p>
        </div>

        <div class="feature-card">
          <i class="ri-global-line"></i>
          <h3>Global Impact</h3>
          <p>Contribute to worldwide carbon reduction efforts</p>
        </div>

        <div class="feature-card">
          <i class="ri-database-2-line"></i>
          <h3>Firebase Integration</h3>
          <p>Real-time data synchronization with Firebase Realtime Database</p>
        </div>

        <div class="feature-card">
          <i class="ri-notification-3-line"></i>
          <h3>Live Notifications</h3>
          <p>Get instant alerts for price changes and trading opportunities</p>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <div class="section-container">
        <h2 class="section-title">Platform Statistics</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(totalTrades) }}</div>
            <div class="stat-label">Total Trades</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${{ formatNumber(totalVolume) }}</div>
            <div class="stat-label">Trading Volume</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(activeUsers) }}</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ formatNumber(carbonCredits) }}</div>
            <div class="stat-label">Carbon Credits</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LiveMarketData from '../../components/LiveMarketData.vue';
import LivePriceTracker from '../../components/LivePriceTracker.vue';

export default {
  name: 'Home',
  components: {
    LiveMarketData,
    LivePriceTracker
  },
  data() {
    return {
      totalTrades: 15420,
      totalVolume: 284700000,
      activeUsers: 3321,
      carbonCredits: 1547832
    };
  },
  computed: {
    ...mapGetters(['market', 'trades'])
  },
  mounted() {
    // Update stats with real data if available
    if (this.market.volume24h) {
      this.totalVolume = this.market.volume24h;
    }
    if (this.trades.length) {
      this.totalTrades = this.trades.length;
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
      return num.toFixed(0);
    }
  }
};
</script>

<style scoped>
.home {
  min-height: calc(100vh - 180px);
}

.hero-section {
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero-content {
  max-width: 800px;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-family: 'Syne', sans-serif;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: var(--text-primary);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-accent);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 1rem 2rem;
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--bg-tertiary);
}

.live-data-section {
  padding: 4rem 0;
  background: var(--bg-primary);
}

.section-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.live-components {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.features-section {
  padding: 6rem 2rem;
  background: var(--bg-secondary);
}

.section-title {
  text-align: center;
  margin-bottom: 4rem;
  font-size: 2.5rem;
  font-family: 'Syne', sans-serif;
}

.features-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-accent);
}

.feature-card i {
  font-size: 2.5rem;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.stats-section {
  padding: 4rem 0;
  background: var(--bg-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 1024px) {
  .live-components {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1.5rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .gradient-text {
    font-size: 3.5rem;
  }

  .features-section {
    padding: 4rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>