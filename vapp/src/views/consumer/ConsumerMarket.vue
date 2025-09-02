<template>
  <div v-if="web3Ready" class="market-container">
    <div class="page-header">
      <h2>Consumer Market Place</h2>
      <BackButton />
    </div>
    
    <div class="market-content">
      <div class="market-section">
        <div class="section-header">
          <h3>Available Credits</h3>
        </div>
        
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itemsList" :key="item.user">
                <td>{{ item.qty }}</td>
                <td>{{ item.price }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="actions-section">
        <div class="action-card">
          <h4>List Credits</h4>
          <form @submit.prevent="listCredit" class="form">
            <div class="form-group">
              <label for="id">Consumer ID</label>
              <input 
                id="id"
                required
                v-model="id"
                type="text"
                placeholder="Enter consumer ID"
              />
            </div>
            
            <div class="form-group">
              <label for="price">Price</label>
              <input
                id="price"
                required
                v-model="price"
                type="text"
                placeholder="Enter price"
              />
            </div>
            
            <div class="form-group">
              <label for="qty">Quantity</label>
              <input
                id="qty"
                required
                v-model="qty"
                type="text"
                placeholder="Enter quantity"
              />
            </div>
            
            <button type="submit" class="submit-button">List Credits</button>
          </form>
        </div>

        <div class="action-card">
          <h4>Buy Credits</h4>
          <form @submit.prevent="buyCredit" class="form">
            <div class="form-group">
              <label for="buyFirmId">Consumer ID</label>
              <input
                id="buyFirmId"
                required
                v-model="buyFirmId"
                type="text"
                placeholder="Enter consumer ID"
              />
            </div>
            
            <div class="form-group">
              <label for="buyQty">Quantity</label>
              <input
                id="buyQty"
                required
                v-model="buyQty"
                type="text"
                placeholder="Enter quantity"
              />
            </div>
            
            <button type="submit" class="submit-button">Buy Credits</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>Loading Web3...</p>
  </div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: 'ConsumerMarket',
  components: {BackButton},
  data() {
    return {
      id: '',
      price: '',
      qty: '',
      buyFirmId: '',
      buyQty: '',
      itemsList: [
        { user: 'user1', qty: 100, price: 10 },
        { user: 'user2', qty: 200, price: 12 },
        { user: 'user3', qty: 150, price: 11 },
      ],
      web3Ready: true
    };
  },
  async mounted() {
    // await this.initContractService();
  },
  methods: {
    async initContractService() {
      try {
        const success = await this.$contractService.initWeb3();
        if (success) {
          this.web3Ready = true; 
          await this.setUp();
        } else {
          this.$bvToast.toast('Failed to initialize Web3 connection', {
            title: 'Connection Error',
            autoHideDelay: 5000,
            variant: 'danger'
          });
        }
      } catch (error) {
        console.error('Error initializing contract service:', error);
        this.$bvToast.toast('Error initializing blockchain connection', {
          title: 'Error',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
    },
    async setUp() {
      try {
        this.itemsList = [];

        const prices = await this.$contractService.getPrices();
        console.log('prices', prices);
        const numListing = await this.$contractService.getNumListings();
        console.log('numListing', numListing);
        const quantity = await this.$contractService.getQuantities();
        console.log('quantity', quantity);

        for (let i = 0; i < numListing; i++) {
          this.itemsList.push({
            price: prices[i],
            qty: quantity[i]
          });
        }

        this.itemsList.sort((a, b) => a.price - b.price);
      } catch (error) {
        console.error('Error setting up marketplace data:', error);
      }
    },
    async listCredit() {
      this.itemsList.push({
        user: 'newuser',
        qty: this.qty,
        price: this.price
      });
      this.itemsList.sort((a, b) => a.price - b.price);
      this.id = '';
      this.price = '';
      this.qty = '';
    },
    async buyCredit() {
      alert(`Buying ${this.buyQty} credits from ${this.buyFirmId}`);
      this.buyFirmId = '';
      this.buyQty = '';
    }
  }
};
</script>

<style scoped>
.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.market-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.market-section {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.section-header {
  background: var(--accent-primary);
  color: var(--bg-primary);
  padding: 16px 24px;
}

.section-header h3 {
  margin: 0;
  color: var(--bg-primary);
}

.table-container {
  padding: 24px;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.action-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  padding: 24px;
  backdrop-filter: blur(10px);
}

.action-card h4 {
  margin-top: 0;
  margin-bottom: 24px;
  color: var(--accent-primary);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
}

.submit-button {
  margin-top: 8px;
}

.loading-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .market-content {
    grid-template-columns: 1fr;
  }
}
</style>