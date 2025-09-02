<template>  <div v-if="web3Ready" ref="foo" id="wrapper">
    <div id="title">
      <h2>Generator Market Place</h2>
      <BackButton/>
    </div>
    <hr style="margin: 0">
    <div id="content">
      <div id="market">
        <h3>Market</h3>        <table class="table">
          <thead style="background: #103B1D; color: white;">
          <tr style='width:18%'>
            <th class="border"><strong>Quantity</strong></th>
            <th class="border"><strong>Offer</strong></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in itemsList" :key="item.index">
            <td class="border" style="width:18%">{{ item.qty }}</td>
            <td class="border" style="width:18%">{{ item.price }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <hr style="width: 1px; height: 100%; background: #103B1D; margin: 30px;"/>
      <div id="order">
        <h3>Order</h3>
        <div class="card">
          <h4>List Credits</h4>
          <hr style="margin: 0">
          <form @submit.prevent="listCredit">
            <label for="id" class="required">Generator ID:</label>
            <input id="id" required v-model="id" name="id" type="text">
            <br>
            <label for="price" class="required">Price:</label>
            <input id="price" required v-model="price" name="price" type="text">
            <br>
            <label for="qty" class="required">Quantity:</label>
            <input id="qty" required v-model="qty" name="qty" type="text">            <br><br>
            <input type="submit" value="List">
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading Web3...</div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: 'GeneratorMarket',
  components: {BackButton},
  data() {
    return {
      id: '',
      price: '',
      qty: '',
      itemsList: [
        { index: 0, qty: 50, price: 8 },
        { index: 1, qty: 100, price: 9 },
        { index: 2, qty: 75, price: 7 },
      ],
      web3Ready: true
    };
  },
  async mounted() {
    // await this.initContractService();
    // if (this.web3Ready) {
    //   await this.setUp();
    // }
  },
  methods: {
    async initContractService() {
      try {
        const success = await this.$contractService.initWeb3();
        if (success) {
          this.web3Ready = true;
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
            qty: quantity[i],
            index: i
          });
        }

        this.itemsList.sort((a, b) => a.price - b.price);
      } catch (error) {
        console.error('Error loading market data:', error);
      }
    },
    async listCredit() {
      this.itemsList.push({
        index: this.itemsList.length,
        qty: this.qty,
        price: this.price
      });
      this.itemsList.sort((a, b) => a.price - b.price);
      this.id = '';
      this.price = '';
      this.qty = '';
    }
  }
};
</script>

<style scoped>
#wrapper {
  height: calc(100vh - 100px - 80px);
}

#title {
  display: flex;
  align-items: center;
  height: 10%;
}

#title h2 {
  margin-bottom: 0;
  margin-left: 40px;
  margin-right: auto;
}

#content {
  display: flex;
  height: 90%;
  align-items: center;
  justify-content: center;
}

#market {
  height: 100%;
  width: 60%;
}

#order {
  height: 100%;
  width: 40%;
}

h3 {
  margin-bottom: 30px;
  text-decoration: underline;
}

.card {
  border-radius: 18px;
  box-shadow: 1px 1px 8px 0 grey;
  display: flex;
}

div {
  padding: 20px;
}

form {
  padding: 20px;
}

label {
  display: inline-block;
  margin: 20px 0 10px;
  width: 25%;
  text-align: left;
  font-weight: bold;
}

input[type="text"], input[type="submit"], select {
  display: inline-block;
  padding: 8px;
  width: 40%;
  border-radius: 10px;
  border: 1px solid #2d3f55;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin: 15px;
}

input[type="submit"] {
  cursor: pointer;
}

input[type="submit"]:hover {
  background: #103B1D;
  border: solid 1px #2d3f55;
  color: white;
}
</style>