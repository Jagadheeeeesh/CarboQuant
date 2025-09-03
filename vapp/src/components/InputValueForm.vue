<template>
  <div class="input-value-form">
    <div class="form-header">
      <h3>Input Values & Data</h3>
      <div class="form-status" :class="{ 'connected': isConnected }">
        <i class="ri-database-2-line"></i>
        {{ isConnected ? 'Connected to Firebase' : 'Connecting...' }}
      </div>
    </div>

    <div class="form-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ 'active': activeTab === tab.id }"
        class="tab-btn"
      >
        <i :class="tab.icon"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Market Data Input -->
    <div v-if="activeTab === 'market'" class="tab-content">
      <div class="form-section">
        <h4>Market Data Input</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Carbon Price ($)</label>
            <input 
              v-model="marketForm.carbonPrice" 
              type="number" 
              step="0.01"
              placeholder="85.50"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Price Change (%)</label>
            <input 
              v-model="marketForm.priceChange" 
              type="number" 
              step="0.01"
              placeholder="2.3"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>24h Volume ($)</label>
            <input 
              v-model="marketForm.volume24h" 
              type="number"
              placeholder="15420000"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Market Cap ($)</label>
            <input 
              v-model="marketForm.marketCap" 
              type="number"
              placeholder="2847000000"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Total Supply</label>
            <input 
              v-model="marketForm.totalSupply" 
              type="number"
              placeholder="33294117"
              class="form-input"
            />
          </div>
        </div>
        <button @click="updateMarketData" class="submit-btn">
          <i class="ri-refresh-line"></i>
          Update Market Data
        </button>
      </div>
    </div>

    <!-- User Credits Input -->
    <div v-if="activeTab === 'credits'" class="tab-content">
      <div class="form-section">
        <h4>Carbon Credits Management</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>User ID/Email</label>
            <input 
              v-model="creditsForm.userId" 
              type="text"
              placeholder="user@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Credits Amount</label>
            <input 
              v-model="creditsForm.amount" 
              type="number"
              min="1"
              placeholder="100"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Validator ID</label>
            <input 
              v-model="creditsForm.validatorId" 
              type="text"
              placeholder="validator@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Action Type</label>
            <select v-model="creditsForm.actionType" class="form-input">
              <option value="allocate">Allocate Credits</option>
              <option value="transfer">Transfer Credits</option>
              <option value="burn">Burn Credits</option>
            </select>
          </div>
        </div>
        <button @click="manageCredits" class="submit-btn">
          <i class="ri-leaf-line"></i>
          {{ creditsForm.actionType === 'allocate' ? 'Allocate' : creditsForm.actionType === 'transfer' ? 'Transfer' : 'Burn' }} Credits
        </button>
      </div>
    </div>

    <!-- Emissions Reporting -->
    <div v-if="activeTab === 'emissions'" class="tab-content">
      <div class="form-section">
        <h4>Emissions Reporting</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Company/User ID</label>
            <input 
              v-model="emissionsForm.userId" 
              type="text"
              placeholder="company@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Emissions (tons CO2)</label>
            <input 
              v-model="emissionsForm.emissions" 
              type="number"
              step="0.01"
              placeholder="150.5"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Reporting Period</label>
            <input 
              v-model="emissionsForm.period" 
              type="month"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Validator ID</label>
            <input 
              v-model="emissionsForm.validatorId" 
              type="text"
              placeholder="validator@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Verification Status</label>
            <select v-model="emissionsForm.verified" class="form-input">
              <option value="true">Verified</option>
              <option value="false">Pending Verification</option>
            </select>
          </div>
        </div>
        <button @click="reportEmissions" class="submit-btn">
          <i class="ri-file-text-line"></i>
          Report Emissions
        </button>
      </div>
    </div>

    <!-- Trading Input -->
    <div v-if="activeTab === 'trading'" class="tab-content">
      <div class="form-section">
        <h4>Manual Trade Entry</h4>
        <div class="form-grid">
          <div class="form-group">
            <label>Trader ID</label>
            <input 
              v-model="tradeForm.userId" 
              type="text"
              placeholder="trader@example.com"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Trade Type</label>
            <select v-model="tradeForm.type" class="form-input">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div class="form-group">
            <label>Amount (CCT)</label>
            <input 
              v-model="tradeForm.amount" 
              type="number"
              min="1"
              placeholder="100"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Price per CCT ($)</label>
            <input 
              v-model="tradeForm.price" 
              type="number"
              step="0.01"
              placeholder="85.50"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Trade Status</label>
            <select v-model="tradeForm.status" class="form-input">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="trade-summary">
          <strong>Total Value: ${{ (tradeForm.amount * tradeForm.price).toFixed(2) }}</strong>
        </div>
        <button @click="createTrade" class="submit-btn">
          <i class="ri-exchange-line"></i>
          Create Trade Entry
        </button>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="recent-activities">
      <h4>Recent Activities</h4>
      <div class="activities-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon">
            <i :class="getActivityIcon(activity.type)"></i>
          </div>
          <div class="activity-details">
            <div class="activity-text">{{ activity.message }}</div>
            <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
          </div>
          <div class="activity-status" :class="activity.status">
            {{ activity.status }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'InputValueForm',
  data() {
    return {
      isConnected: false,
      activeTab: 'market',
      tabs: [
        { id: 'market', label: 'Market Data', icon: 'ri-line-chart-line' },
        { id: 'credits', label: 'Credits', icon: 'ri-leaf-line' },
        { id: 'emissions', label: 'Emissions', icon: 'ri-file-text-line' },
        { id: 'trading', label: 'Trading', icon: 'ri-exchange-line' }
      ],
      marketForm: {
        carbonPrice: 85.50,
        priceChange: 2.3,
        volume24h: 15420000,
        marketCap: 2847000000,
        totalSupply: 33294117
      },
      creditsForm: {
        userId: '',
        amount: 100,
        validatorId: '',
        actionType: 'allocate'
      },
      emissionsForm: {
        userId: '',
        emissions: 0,
        period: '',
        validatorId: '',
        verified: 'true'
      },
      tradeForm: {
        userId: '',
        type: 'buy',
        amount: 100,
        price: 85.50,
        status: 'pending'
      },
      recentActivities: []
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    this.checkConnection();
    this.loadRecentActivities();
  },
  methods: {
    checkConnection() {
      // Test Firebase connection
      setTimeout(() => {
        this.isConnected = true;
      }, 1000);
    },
    async updateMarketData() {
      try {
        await this.$firebaseService.updateMarketData(this.marketForm);
        
        this.addActivity({
          type: 'market',
          message: `Market data updated: Carbon price $${this.marketForm.carbonPrice}`,
          status: 'success'
        });

        this.$toasted.show('Market data updated successfully!', {
          type: 'success',
          duration: 3000
        });

      } catch (error) {
        console.error('Error updating market data:', error);
        this.$toasted.show('Error updating market data', {
          type: 'error',
          duration: 3000
        });
      }
    },
    async manageCredits() {
      if (!this.creditsForm.userId || !this.creditsForm.amount) {
        this.$toasted.show('Please fill in all required fields', {
          type: 'error',
          duration: 3000
        });
        return;
      }

      try {
        if (this.creditsForm.actionType === 'allocate') {
          await this.$firebaseService.allocateCredits(
            this.creditsForm.userId,
            this.creditsForm.amount,
            this.creditsForm.validatorId
          );
        }

        this.addActivity({
          type: 'credits',
          message: `${this.creditsForm.actionType} ${this.creditsForm.amount} credits for ${this.creditsForm.userId}`,
          status: 'success'
        });

        this.$toasted.show(`Credits ${this.creditsForm.actionType}d successfully!`, {
          type: 'success',
          duration: 3000
        });

        // Reset form
        this.creditsForm.userId = '';
        this.creditsForm.amount = 100;

      } catch (error) {
        console.error('Error managing credits:', error);
        this.$toasted.show('Error managing credits', {
          type: 'error',
          duration: 3000
        });
      }
    },
    async reportEmissions() {
      if (!this.emissionsForm.userId || !this.emissionsForm.emissions) {
        this.$toasted.show('Please fill in all required fields', {
          type: 'error',
          duration: 3000
        });
        return;
      }

      try {
        await this.$firebaseService.reportEmissions(
          this.emissionsForm.userId,
          this.emissionsForm.emissions,
          this.emissionsForm.validatorId
        );

        this.addActivity({
          type: 'emissions',
          message: `Emissions reported: ${this.emissionsForm.emissions} tons CO2 for ${this.emissionsForm.userId}`,
          status: 'success'
        });

        this.$toasted.show('Emissions reported successfully!', {
          type: 'success',
          duration: 3000
        });

        // Reset form
        this.emissionsForm.userId = '';
        this.emissionsForm.emissions = 0;

      } catch (error) {
        console.error('Error reporting emissions:', error);
        this.$toasted.show('Error reporting emissions', {
          type: 'error',
          duration: 3000
        });
      }
    },
    async createTrade() {
      if (!this.tradeForm.userId || !this.tradeForm.amount || !this.tradeForm.price) {
        this.$toasted.show('Please fill in all required fields', {
          type: 'error',
          duration: 3000
        });
        return;
      }

      try {
        const tradeData = {
          userId: this.tradeForm.userId,
          type: this.tradeForm.type,
          amount: parseFloat(this.tradeForm.amount),
          price: parseFloat(this.tradeForm.price),
          total: this.tradeForm.amount * this.tradeForm.price,
          status: this.tradeForm.status,
          userEmail: this.tradeForm.userId
        };

        await this.$firebaseService.createTrade(tradeData);

        this.addActivity({
          type: 'trading',
          message: `Trade created: ${this.tradeForm.type} ${this.tradeForm.amount} CCT @ $${this.tradeForm.price}`,
          status: 'success'
        });

        this.$toasted.show('Trade entry created successfully!', {
          type: 'success',
          duration: 3000
        });

        // Reset form
        this.tradeForm.userId = '';
        this.tradeForm.amount = 100;

      } catch (error) {
        console.error('Error creating trade:', error);
        this.$toasted.show('Error creating trade entry', {
          type: 'error',
          duration: 3000
        });
      }
    },
    addActivity(activity) {
      this.recentActivities.unshift({
        id: Date.now(),
        ...activity,
        timestamp: new Date()
      });
      
      // Keep only last 10 activities
      if (this.recentActivities.length > 10) {
        this.recentActivities = this.recentActivities.slice(0, 10);
      }
    },
    loadRecentActivities() {
      // Load some sample activities
      this.recentActivities = [
        {
          id: 1,
          type: 'market',
          message: 'Market data initialized',
          status: 'success',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: 2,
          type: 'credits',
          message: 'Sample credits allocated',
          status: 'success',
          timestamp: new Date(Date.now() - 600000)
        }
      ];
    },
    getActivityIcon(type) {
      const icons = {
        'market': 'ri-line-chart-line',
        'credits': 'ri-leaf-line',
        'emissions': 'ri-file-text-line',
        'trading': 'ri-exchange-line'
      };
      return icons[type] || 'ri-information-line';
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    }
  }
};
</script>

<style scoped>
.input-value-form {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.form-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.form-status.connected {
  color: var(--accent-primary);
}

.form-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--glass-border);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-content {
  margin-bottom: 2rem;
}

.form-section h4 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb), 0.2);
}

.trade-summary {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: var(--accent-secondary);
  transform: translateY(-1px);
}

.recent-activities h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.activity-time {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.activity-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 600;
}

.activity-status.success {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.activity-status.error {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.activity-status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .form-tabs {
    overflow-x: auto;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>