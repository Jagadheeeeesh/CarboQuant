<template>
  <div class="trading-interface">
    <div class="trading-header">
      <h3>Carbon Credit Trading</h3>
      <div class="user-balance" v-if="user.loggedIn">
        <i class="ri-leaf-line"></i>
        <span>Balance: {{ userCredits }} CCT</span>
      </div>
    </div>

    <div class="trading-panels">
      <!-- Buy Panel -->
      <div class="trading-panel buy-panel">
        <div class="panel-header">
          <h4><i class="ri-shopping-cart-line"></i> Buy Credits</h4>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label>Amount (CCT)</label>
            <input 
              v-model="buyForm.amount" 
              type="number" 
              min="1" 
              placeholder="Enter amount"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Price per CCT ($)</label>
            <input 
              v-model="buyForm.price" 
              type="number" 
              step="0.01" 
              placeholder="Market price"
              class="form-input"
            />
          </div>
          <div class="total-cost">
            <strong>Total Cost: ${{ (buyForm.amount * buyForm.price).toFixed(2) }}</strong>
          </div>
          <button 
            @click="executeBuy" 
            :disabled="!canExecuteBuy"
            class="action-btn buy-btn"
          >
            <i class="ri-arrow-up-line"></i>
            Buy Credits
          </button>
        </div>
      </div>

      <!-- Sell Panel -->
      <div class="trading-panel sell-panel">
        <div class="panel-header">
          <h4><i class="ri-hand-coin-line"></i> Sell Credits</h4>
        </div>
        <div class="panel-body">
          <div class="form-group">
            <label>Amount (CCT)</label>
            <input 
              v-model="sellForm.amount" 
              type="number" 
              min="1" 
              :max="userCredits"
              placeholder="Enter amount"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Price per CCT ($)</label>
            <input 
              v-model="sellForm.price" 
              type="number" 
              step="0.01" 
              placeholder="Market price"
              class="form-input"
            />
          </div>
          <div class="total-revenue">
            <strong>Total Revenue: ${{ (sellForm.amount * sellForm.price).toFixed(2) }}</strong>
          </div>
          <button 
            @click="executeSell" 
            :disabled="!canExecuteSell"
            class="action-btn sell-btn"
          >
            <i class="ri-arrow-down-line"></i>
            Sell Credits
          </button>
        </div>
      </div>
    </div>

    <!-- Market Orders -->
    <div class="market-orders" v-if="marketOrders.length > 0">
      <h4>Market Orders</h4>
      <div class="orders-table">
        <div class="table-header">
          <div>Type</div>
          <div>Amount</div>
          <div>Price</div>
          <div>Total</div>
          <div>Time</div>
          <div>Action</div>
        </div>
        <div class="table-row" v-for="order in marketOrders" :key="order.id">
          <div class="order-type" :class="order.type">{{ order.type.toUpperCase() }}</div>
          <div>{{ order.amount }} CCT</div>
          <div>${{ order.price.toFixed(2) }}</div>
          <div>${{ (order.amount * order.price).toFixed(2) }}</div>
          <div>{{ formatTime(order.createdAt) }}</div>
          <div>
            <button @click="fulfillOrder(order)" class="fulfill-btn">
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="transaction-history" v-if="userTrades.length > 0">
      <h4>Your Transaction History</h4>
      <div class="history-list">
        <div class="history-item" v-for="trade in userTrades" :key="trade.id">
          <div class="trade-details">
            <div class="trade-type" :class="trade.type">
              <i :class="trade.type === 'buy' ? 'ri-arrow-up-line' : 'ri-arrow-down-line'"></i>
              {{ trade.type.toUpperCase() }}
            </div>
            <div class="trade-info">
              <span class="amount">{{ trade.amount }} CCT</span>
              <span class="price">@ ${{ trade.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="trade-meta">
            <div class="total">${{ (trade.amount * trade.price).toFixed(2) }}</div>
            <div class="time">{{ formatTime(trade.createdAt) }}</div>
            <div class="status" :class="trade.status">{{ trade.status }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TradingInterface',
  data() {
    return {
      buyForm: {
        amount: 1,
        price: 85.50
      },
      sellForm: {
        amount: 1,
        price: 85.50
      },
      marketOrders: [],
      userTrades: [],
      tradesUnsubscribe: null
    };
  },
  computed: {
    ...mapGetters(['user', 'userCredits', 'prices']),
    canExecuteBuy() {
      return this.user.loggedIn && 
             this.buyForm.amount > 0 && 
             this.buyForm.price > 0;
    },
    canExecuteSell() {
      return this.user.loggedIn && 
             this.sellForm.amount > 0 && 
             this.sellForm.price > 0 &&
             this.sellForm.amount <= this.userCredits;
    }
  },
  mounted() {
    this.initializePrices();
    this.loadUserTrades();
    this.generateMockOrders();
  },
  beforeDestroy() {
    if (this.tradesUnsubscribe) {
      this.tradesUnsubscribe();
    }
  },
  methods: {
    initializePrices() {
      const currentPrice = this.prices.carbon?.price || 85.50;
      this.buyForm.price = currentPrice;
      this.sellForm.price = currentPrice;
    },
    async executeBuy() {
      if (!this.canExecuteBuy) return;

      try {
        const tradeData = {
          userId: this.user.data.uid,
          type: 'buy',
          amount: parseFloat(this.buyForm.amount),
          price: parseFloat(this.buyForm.price),
          total: this.buyForm.amount * this.buyForm.price,
          userEmail: this.user.data.email
        };

        const tradeId = await this.$firebaseService.createTrade(tradeData);
        
        // Send notification
        await this.$firebaseService.sendNotification(
          this.user.data.uid,
          `Buy order placed: ${tradeData.amount} CCT @ $${tradeData.price.toFixed(2)}`,
          'trade'
        );

        this.$toasted.show(`Buy order placed successfully!`, {
          type: 'success',
          duration: 3000
        });

        // Reset form
        this.buyForm.amount = 1;
        this.loadUserTrades();

      } catch (error) {
        console.error('Error executing buy:', error);
        this.$toasted.show('Error placing buy order', {
          type: 'error',
          duration: 3000
        });
      }
    },
    async executeSell() {
      if (!this.canExecuteSell) return;

      try {
        const tradeData = {
          userId: this.user.data.uid,
          type: 'sell',
          amount: parseFloat(this.sellForm.amount),
          price: parseFloat(this.sellForm.price),
          total: this.sellForm.amount * this.sellForm.price,
          userEmail: this.user.data.email
        };

        const tradeId = await this.$firebaseService.createTrade(tradeData);
        
        // Send notification
        await this.$firebaseService.sendNotification(
          this.user.data.uid,
          `Sell order placed: ${tradeData.amount} CCT @ $${tradeData.price.toFixed(2)}`,
          'trade'
        );

        this.$toasted.show(`Sell order placed successfully!`, {
          type: 'success',
          duration: 3000
        });

        // Reset form
        this.sellForm.amount = 1;
        this.loadUserTrades();

      } catch (error) {
        console.error('Error executing sell:', error);
        this.$toasted.show('Error placing sell order', {
          type: 'error',
          duration: 3000
        });
      }
    },
    async loadUserTrades() {
      if (!this.user.loggedIn) return;

      try {
        this.userTrades = await this.$firebaseService.getUserTrades(this.user.data.uid);
      } catch (error) {
        console.error('Error loading user trades:', error);
      }
    },
    generateMockOrders() {
      // Generate some mock market orders for demonstration
      this.marketOrders = [
        {
          id: 1,
          type: 'buy',
          amount: 100,
          price: 84.50,
          createdAt: new Date(Date.now() - 300000) // 5 minutes ago
        },
        {
          id: 2,
          type: 'sell',
          amount: 250,
          price: 86.00,
          createdAt: new Date(Date.now() - 180000) // 3 minutes ago
        },
        {
          id: 3,
          type: 'buy',
          amount: 75,
          price: 85.25,
          createdAt: new Date(Date.now() - 120000) // 2 minutes ago
        }
      ];
    },
    async fulfillOrder(order) {
      if (!this.user.loggedIn) {
        this.$toasted.show('Please login to execute orders', {
          type: 'error',
          duration: 3000
        });
        return;
      }

      try {
        const oppositeType = order.type === 'buy' ? 'sell' : 'buy';
        
        const tradeData = {
          userId: this.user.data.uid,
          type: oppositeType,
          amount: order.amount,
          price: order.price,
          total: order.amount * order.price,
          userEmail: this.user.data.email,
          matchedOrderId: order.id
        };

        await this.$firebaseService.createTrade(tradeData);
        
        // Remove the fulfilled order
        this.marketOrders = this.marketOrders.filter(o => o.id !== order.id);
        
        // Send notification
        await this.$firebaseService.sendNotification(
          this.user.data.uid,
          `Order executed: ${oppositeType} ${order.amount} CCT @ $${order.price.toFixed(2)}`,
          'success'
        );

        this.$toasted.show(`Order executed successfully!`, {
          type: 'success',
          duration: 3000
        });

        this.loadUserTrades();

      } catch (error) {
        console.error('Error fulfilling order:', error);
        this.$toasted.show('Error executing order', {
          type: 'error',
          duration: 3000
        });
      }
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
.trading-interface {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
}

.trading-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.trading-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.user-balance {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--glass-border);
  color: var(--accent-primary);
  font-weight: 600;
}

.trading-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.trading-panel {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.panel-header {
  padding: 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.panel-header h4 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
}

.buy-panel .panel-header {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.sell-panel .panel-header {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.panel-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb), 0.2);
}

.total-cost,
.total-revenue {
  margin: 1rem 0;
  padding: 0.75rem;
  background: var(--glass-bg);
  border-radius: var(--border-radius-sm);
  text-align: center;
  color: var(--text-primary);
}

.action-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.buy-btn {
  background: #4CAF50;
  color: white;
}

.buy-btn:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
}

.sell-btn {
  background: #F44336;
  color: white;
}

.sell-btn:hover:not(:disabled) {
  background: #da190b;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.market-orders,
.transaction-history {
  margin-bottom: 2rem;
}

.market-orders h4,
.transaction-history h4 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.orders-table {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: var(--glass-bg);
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--glass-border);
  align-items: center;
}

.order-type {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-size: 0.8rem;
}

.order-type.buy {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.order-type.sell {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.fulfill-btn {
  background: var(--accent-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.fulfill-btn:hover {
  background: var(--accent-secondary);
  transform: translateY(-1px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
}

.trade-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.trade-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: var(--border-radius-sm);
}

.trade-type.buy {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.trade-type.sell {
  background: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.trade-info {
  display: flex;
  gap: 1rem;
}

.amount {
  font-weight: 600;
  color: var(--text-primary);
}

.price {
  color: var(--text-secondary);
}

.trade-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.total {
  font-weight: 600;
  color: var(--text-primary);
}

.time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 600;
}

.status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.status.completed {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

@media (max-width: 768px) {
  .trading-panels {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr 1fr;
    font-size: 0.8rem;
  }
  
  .trading-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .trade-meta {
    align-items: flex-start;
  }
}
</style>