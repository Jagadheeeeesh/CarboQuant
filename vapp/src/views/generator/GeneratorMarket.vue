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
      itemsList: [],
      web3Ready: false
    };
  },
  async mounted() {
    await this.initContractService();
    if (this.web3Ready) {
      await this.setUp();
    }
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
      if (!this.web3Ready) {
        alert("Blockchain connection not ready");
        return;
      }

      try {
        // Check if generator ID is listed
        const genList = await this.$contractService.getGeneratorList();
        console.log('genList', genList);
        const genIdNumber = parseInt(this.id);
        
        if (!genList.some(id => parseInt(id) === genIdNumber)) {
          const display = `Generator ${this.id} has not been created. Please use an ID that has been listed`;
          this.$bvToast.toast(display, {
            title: 'Unsuccessful',
            autoHideDelay: 5000,
            variant: 'danger'
          });
          return;        }

        // Check if prices is already listed
        const prices = await this.$contractService.getPrices();
        console.log('prices', prices);
        if (prices.some(price => parseInt(price) === parseInt(this.price))) {
          const display = `Price ${this.price} has already been listed. Please list another price!`;
          this.$bvToast.toast(display, {
            title: 'Unsuccessful',
            autoHideDelay: 5000,
            variant: 'danger'
          });
          return;
        }

        // Check if quantity or price is 0
        if (Number(this.qty) === 0 || Number(this.price) === 0) {
          const display = `Please list a valid price or quantity!`;
          this.$bvToast.toast(display, {
            title: 'Unsuccessful',
            autoHideDelay: 5000,
            variant: 'danger'
          });
          return;
        }

        // Check if quantity specified is > than current ID's balance
        const balance = await this.$contractService.getGeneratorCredits(genIdNumber);
        console.log('balance', balance);
        console.log('quan:', this.qty);
        if (Number(this.qty) > Number(balance)) {
          const display = `Specified quantity of ${this.qty} exceeds current generator ID's token balance of ${balance}. Please specify a quantity lower than ${balance}!`;
          this.$bvToast.toast(display, {
            title: 'Unsuccessful',
            autoHideDelay: 5000,
            variant: 'danger'
          });
          return;
        }

        // List credits using ContractService
        await this.$contractService.listCredit(genIdNumber, this.price, this.qty);

        // Update local list
        this.itemsList.push({
          price: this.price,
          qty: this.qty,
          index: this.itemsList.length
        });

        this.itemsList.sort((a, b) => a.price - b.price);

        const display = `Generator ${this.id} successfully listed ${this.qty} credit(s) for ${this.price}`;
        this.$bvToast.toast(display, {
          title: 'Successful',
          autoHideDelay: 5000,
          variant: 'success'
        });

        // Clear form
        this.id = '';
        this.price = '';
        this.qty = '';
      } catch (error) {
                console.error('Error listing credit:', error);
        this.$bvToast.toast('Error listing credit: ' + error.message, {
          title: 'Error',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
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