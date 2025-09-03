<template>
  <div class="live-price-tracker">
    <div class="price-header">
      <h3>Carbon Credit Price</h3>
      <div class="price-controls">
        <button @click="toggleAutoUpdate" :class="{ 'active': autoUpdate }">
          <i class="ri-refresh-line"></i>
          Auto Update
        </button>
      </div>
    </div>
    
    <div class="price-display">
      <div class="current-price">
        <span class="currency">$</span>
        <span class="price">{{ currentPrice.toFixed(2) }}</span>
        <div class="price-change" :class="priceChangeClass">
          <i :class="priceChangeIcon"></i>
          {{ Math.abs(priceChange).toFixed(2) }}%
        </div>
      </div>
      <div class="price-time">
        Last updated: {{ lastUpdateTime }}
      </div>
    </div>
    
    <div class="price-chart" v-if="priceHistory.length > 0">
      <div class="chart-header">
        <h4>Price History (30 days)</h4>
      </div>
      <div class="simple-chart">
        <div class="chart-bars">
          <div 
            v-for="(point, index) in priceHistory" 
            :key="index"
            class="chart-bar"
            :style="{ height: getBarHeight(point.price) + '%' }"
            :title="`$${point.price.toFixed(2)} on ${formatDate(point.date)}`"
          ></div>
        </div>
      </div>
    </div>
    
    <div class="price-alerts">
      <h4>Price Alerts</h4>
      <div class="alert-form">
        <input 
          v-model="newAlert.price" 
          type="number" 
          step="0.01" 
          placeholder="Alert price"
          class="alert-input"
        />
        <select v-model="newAlert.type" class="alert-select">
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <button @click="addAlert" class="add-alert-btn">Add Alert</button>
      </div>
      <div class="active-alerts" v-if="alerts.length > 0">
        <div v-for="alert in alerts" :key="alert.id" class="alert-item">
          <span>{{ alert.type }} ${{ alert.price }}</span>
          <button @click="removeAlert(alert.id)" class="remove-alert">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LivePriceTracker',
  data() {
    return {
      autoUpdate: true,
      priceUnsubscribe: null,
      priceHistory: [],
      alerts: [],
      newAlert: {
        price: '',
        type: 'above'
      },
      lastUpdateTime: '',
      updateInterval: null
    };
  },
  computed: {
    ...mapGetters(['prices']),
    currentPrice() {
      return this.prices.carbon?.price || 0;
    },
    priceChange() {
      return this.prices.carbon?.change || 0;
    },
    priceChangeClass() {
      return {
        'positive': this.priceChange > 0,
        'negative': this.priceChange < 0,
        'neutral': this.priceChange === 0
      };
    },
    priceChangeIcon() {
      if (this.priceChange > 0) return 'ri-arrow-up-line';
      if (this.priceChange < 0) return 'ri-arrow-down-line';
      return 'ri-subtract-line';
    }
  },
  mounted() {
    this.subscribeToPrices();
    this.loadPriceHistory();
    this.loadAlerts();
    this.startAutoUpdate();
  },
  beforeDestroy() {
    if (this.priceUnsubscribe) {
      this.priceUnsubscribe();
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
  methods: {
    subscribeToPrices() {
      this.priceUnsubscribe = this.$firebaseService.onPriceChange((prices) => {
        if (prices) {
          this.$store.dispatch('updatePrices', prices);
          this.lastUpdateTime = new Date().toLocaleTimeString();
          this.checkAlerts(prices.carbon?.price);
        }
      });
    },
    async loadPriceHistory() {
      try {
        // Load price history from Firebase
        const priceHistoryRef = this.$firebaseService.realtimeDb;
        const { ref, get } = await import('firebase/database');
        const historyRef = ref(priceHistoryRef, 'priceHistory');
        const snapshot = await get(historyRef);
        
        if (snapshot.exists()) {
          this.priceHistory = snapshot.val() || [];
        }
      } catch (error) {
        console.error('Error loading price history:', error);
      }
    },
    loadAlerts() {
      const savedAlerts = localStorage.getItem('priceAlerts');
      if (savedAlerts) {
        this.alerts = JSON.parse(savedAlerts);
      }
    },
    saveAlerts() {
      localStorage.setItem('priceAlerts', JSON.stringify(this.alerts));
    },
    addAlert() {
      if (this.newAlert.price && !isNaN(this.newAlert.price)) {
        const alert = {
          id: Date.now(),
          price: parseFloat(this.newAlert.price),
          type: this.newAlert.type,
          active: true
        };
        this.alerts.push(alert);
        this.saveAlerts();
        this.newAlert.price = '';
        this.$toasted.show(`Price alert added: ${alert.type} $${alert.price}`, {
          type: 'success',
          duration: 3000
        });
      }
    },
    removeAlert(alertId) {
      this.alerts = this.alerts.filter(alert => alert.id !== alertId);
      this.saveAlerts();
    },
    checkAlerts(currentPrice) {
      if (!currentPrice) return;
      
      this.alerts.forEach(alert => {
        if (alert.active) {
          const triggered = 
            (alert.type === 'above' && currentPrice >= alert.price) ||
            (alert.type === 'below' && currentPrice <= alert.price);
          
          if (triggered) {
            alert.active = false;
            this.$toasted.show(
              `Price Alert: Carbon credit is ${alert.type} $${alert.price}! Current: $${currentPrice.toFixed(2)}`,
              {
                type: 'info',
                duration: 5000
              }
            );
          }
        }
      });
      this.saveAlerts();
    },
    toggleAutoUpdate() {
      this.autoUpdate = !this.autoUpdate;
      if (this.autoUpdate) {
        this.startAutoUpdate();
      } else {
        this.stopAutoUpdate();
      }
    },
    startAutoUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      
      this.updateInterval = setInterval(() => {
        if (this.autoUpdate) {
          // Simulate price updates for demo
          this.simulatePriceUpdate();
        }
      }, 5000); // Update every 5 seconds
    },
    stopAutoUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    },
    async simulatePriceUpdate() {
      // Simulate realistic price movements
      const currentPrice = this.currentPrice || 85.50;
      const change = (Math.random() - 0.5) * 2; // -1% to +1%
      const newPrice = currentPrice * (1 + change / 100);
      
      try {
        await this.$firebaseService.updateCarbonPrice(newPrice, change);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    },
    getBarHeight(price) {
      if (this.priceHistory.length === 0) return 0;
      const prices = this.priceHistory.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return ((price - min) / (max - min)) * 100;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.live-price-tracker {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.price-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.price-controls button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.price-controls button.active {
  background: var(--accent-primary);
  color: white;
}

.price-display {
  text-align: center;
  margin-bottom: 2rem;
}

.current-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 2rem;
  color: var(--text-secondary);
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
}

.price-change.positive {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.price-change.negative {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.price-change.neutral {
  background: rgba(158, 158, 158, 0.2);
  color: #9E9E9E;
}

.price-time {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.price-chart {
  margin-bottom: 2rem;
}

.chart-header h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.simple-chart {
  height: 200px;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--glass-border);
}

.chart-bars {
  display: flex;
  align-items: end;
  height: 100%;
  gap: 2px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.chart-bar:hover {
  opacity: 0.8;
}

.price-alerts h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.alert-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.alert-input,
.alert-select {
  padding: 0.5rem;
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.add-alert-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 600;
}

.active-alerts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.remove-alert {
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  font-size: 1.2rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .current-price {
    flex-direction: column;
    gap: 1rem;
  }
  
  .price {
    font-size: 2.5rem;
  }
  
  .alert-form {
    flex-direction: column;
  }
}
</style>