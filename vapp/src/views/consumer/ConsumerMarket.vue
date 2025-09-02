<template>
  <div v-if="isDrizzleInitialized" class="market-container">
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
    <p>Loading marketplace data...</p>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
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
      itemsList: []
    };
  },
  computed: {
    ...mapGetters("drizzle", ["isDrizzleInitialized", "drizzleInstance"]),
    ...mapGetters('accounts', ['activeAccount', 'activeBalance'])
  },
  methods: {
    async setUp() {
      this.itemsList = [];

      const prices = await this.drizzleInstance.contracts['MarketPlace'].methods.getPrices().call();
      window.console.log('prices', prices);
      const numListing = await this.drizzleInstance.contracts['MarketPlace'].methods.getNumListings().call();
      window.console.log('numListing', numListing);
      const quantity = await this.drizzleInstance.contracts['MarketPlace'].methods.getQty().call();
      window.console.log('quantity', quantity);

      for (let i = 0; i < numListing; i++) {
        this.itemsList.push({
          price: prices[i],
          qty: quantity[i]
        });
      }

      this.itemsList.sort((a, b) => a.price - b.price);
    },
    async listCredit() {
      // check if consumer ID is already listed
      const conList = await this.drizzleInstance.contracts['CarbonCredit'].methods.getConsumerList().call();
      window.console.log('conList', conList);
      if (!(conList.includes(this.id.toString()))) {
        const display = `Consumer ${this.id} has not been created. Please use an ID that has been listed`;
        this.$bvToast.toast(display, {
          title: 'Unsuccessful',
          autoHideDelay: 5000,
          variant: 'danger'
        });
        return;
      }

      // check if prices is already listed
      const prices = await this.drizzleInstance.contracts['MarketPlace'].methods.getPrices().call();
      window.console.log('prices', prices);
      if (prices.includes(this.price.toString())) {
        const display = `Price ${this.price} has already been listed. Please list another price!`;
        this.$bvToast.toast(display, {
          title: 'Unsuccessful',
          autoHideDelay: 5000,
          variant: 'danger'
        });
        return;
      }

      // check if quantity or price is 0
      if (Number(this.qty) === 0 || Number(this.price) === 0) {
        const display = `Please list a valid price or quantity!`;
        this.$bvToast.toast(display, {
          title: 'Unsuccessful',
          autoHideDelay: 5000,
          variant: 'danger'
        });
        return;
      }

      // check if quantity specified is > than current ID's balance
      const balance = await this.drizzleInstance.contracts['CarbonCredit'].methods.getConsumerCredits(this.id).call();
      window.console.log('balance', balance);
      window.console.log('quan:', this.qty);
      if (Number(this.qty) > Number(balance)) {
        const display = `Specified quantity of ${this.qty} exceeds current consumer ID's token balance of ${balance}. Please specify a quantity lower than ${balance}!`;
        this.$bvToast.toast(display, {
          title: 'Unsuccessful',
          autoHideDelay: 5000,
          variant: 'danger'
        });
        return;
      }

      // approve consumer with 100 credits
      const marketAddress = await this.drizzleInstance.contracts['MarketPlace'].address;
      const approval = await this.drizzleInstance.contracts['CarbonCredit'].methods['approve'];
      await approval.cacheSend(marketAddress, 100);

      // list credits
      const listCredit = await this.drizzleInstance.contracts['MarketPlace'].methods['listCredit'];
      await listCredit.cacheSend(this.id, this.price, this.qty, {gas: 1000000});

      this.itemsList.push({
        price: this.price,
        qty: this.qty
      });

      this.itemsList.sort((a, b) => a.price - b.price);

      const display = `Consumer ${this.id} successfully listed ${this.qty} credit(s) for ${this.price}`;
      this.$bvToast.toast(display, {
        title: 'Successful',
        autoHideDelay: 5000,
        variant: 'success'
      });
    },
    async buyCredit() {
      const numListing = await this.drizzleInstance.contracts['MarketPlace'].methods.getNumListings().call();

      // Check if there are listings
      if (Number(numListing) !== 0) {
        // approve credits to be listed
        const marketAddress = await this.drizzleInstance.contracts['MarketPlace'].address;
        const approval = await this.drizzleInstance.contracts['CarbonCredit'].methods['approve'];
        await approval.cacheSend(marketAddress, this.buyQty);

        // buying credits
        const buyCredit = await this.drizzleInstance.contracts['MarketPlace'].methods['buyCredit'];
        await buyCredit.cacheSend(this.buyFirmId, this.buyQty, {gas: 1000000});

        // DO NOT REMOVE: function to delay the calling for subsequent functions (must-have)
        const numListing = await this.drizzleInstance.contracts['MarketPlace'].methods.getNumListings().call();
        window.console.log('here', numListing);

        const lastNumFilled = await this.drizzleInstance.contracts['MarketPlace'].methods.getLastNumFilled().call();
        window.console.log('lastNumFilled', lastNumFilled);
        const lastAvgPriceFilled = await this.drizzleInstance.contracts['MarketPlace'].methods.getLastAvgPriceFilled().call();
        window.console.log('lastAvgPriceFilled', lastAvgPriceFilled);

        const display = `Filled: ${lastNumFilled} units, Average Filled Price: $${lastAvgPriceFilled}`;
        this.$bvToast.toast(display, {
          title: 'Order Filled',
          autoHideDelay: 5000,
          variant: 'success'
        });

        await this.setUp();
      } else {
        const display = `There are no listings. Purchase is not permitted.`;
        this.$bvToast.toast(display, {
          title: 'Order Failed',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
    },
  },
  mounted() {
    if (this.$refs.foo) {
      if (this.isDrizzleInitialized) {
        window.console.log('initialized');
        this.setUp();
      } else {
        alert("Drizzle doesn't seem to be initialised / ready");
      }
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
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

.section-header {
  background: var(--primary-color);
  color: white;
  padding: 16px 24px;
}

.section-header h3 {
  margin: 0;
  color: white;
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
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 24px;
}

.action-card h4 {
  margin-top: 0;
  margin-bottom: 24px;
  color: var(--primary-color);
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
  border-top: 4px solid var(--primary-color);
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
