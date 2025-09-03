<template>
  <div class="live-market-data">
    <div class="market-header">
      <h3>Live Market Data</h3>
      <div class="status-indicator" :class="{ 'connected': isConnected }">
        <span class="status-dot"></span>
        {{ isConnected ? 'LIVE' : 'OFFLINE' }}
      </div>
    </div>
    
    <div class="market-stats">
      <div class="stat-card">
        <div class="stat-label">Carbon Price</div>
        <div class="stat-value">
          ${{ market.carbonPrice.toFixed(2) }}
          <span class="price-change" :class="{ 'positive': market.priceChange > 0, 'negative': market.priceChange < 0 }">
            {{ market.priceChange > 0 ? '+' : '' }}{{ market.priceChange.toFixed(2) }}%
          </span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">24h Volume</div>
        <div class="stat-value">${{ formatNumber(market.volume24h) }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Market Cap</div>
        <div class="stat-value">${{ formatNumber(market.marketCap) }}</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-label">Total Supply</div>
        <div class="stat-value">{{ formatNumber(market.totalSupply) }} CCT</div>
      </div>
    </div>
    
    <div class="recent-trades" v-if="trades.length > 0">
      <h4>Recent Trades</h4>
      <div class="trades-list">
        <div class="trade-item" v-for="trade in recentTrades" :key="trade.id">
          <div class="trade-info">
            <span class="trade-amount">{{ trade.amount }} CCT</span>
            <span class="trade-price">${{ trade.price.toFixed(2) }}</span>
          </div>
          <div class="trade-time">{{ formatTime(trade.createdAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LiveMarketData',
  data() {
    return {
      isConnected: false,
      marketDataUnsubscribe: null,
      tradesUnsubscribe: null
    };
  },
  computed: {
    ...mapGetters(['market', 'trades']),
    recentTrades() {
      return this.trades.slice(0, 5);
    }
  },
  mounted() {
    this.subscribeToMarketData();
    this.subscribeToTrades();
  },
  beforeDestroy() {
    if (this.marketDataUnsubscribe) {
      this.marketDataUnsubscribe();
    }
    if (this.tradesUnsubscribe) {
      this.tradesUnsubscribe();
    }
  },
  methods: {
    subscribeToMarketData() {
      this.marketDataUnsubscribe = this.$firebaseService.onMarketDataChange((data) => {
        if (data) {
          this.isConnected = true;
          this.$store.dispatch('updateMarketData', data);
        }
      });
    },
    subscribeToTrades() {
      this.tradesUnsubscribe = this.$firebaseService.onTradesChange((trades) => {
        this.$store.dispatch('updateTrades', trades);
      });
    },
    formatNumber(num) {
      if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
      return num.toFixed(0);
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.live-market-data {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.market-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.status-indicator.connected {
  color: var(--accent-primary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
  animation: pulse 2s infinite;
}

.status-indicator.connected .status-dot {
  background: var(--accent-primary);
}

.market-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  padding: 1.5rem;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.price-change {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.price-change.positive {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.price-change.negative {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.recent-trades h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.trades-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.trade-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--glass-border);
}

.trade-info {
  display: flex;
  gap: 1rem;
}

.trade-amount {
  font-weight: 600;
  color: var(--accent-primary);
}

.trade-price {
  color: var(--text-primary);
}

.trade-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .market-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-value {
    font-size: 1.2rem;
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>