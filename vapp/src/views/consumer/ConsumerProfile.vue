<template>
  <div v-if="web3Ready" id="wrapper">
    <!-- Sidenav -->
    <div class="row" ref="foo">
      <div class="profile left">
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt=""
             width="130" height="130">
        <div class="name">{{ this.name }}</div>
        <div class="userType">Consumer</div>
      </div>

      <!-- Main -->
      <div class="main right">
        <div id="title">
          <h2>Personal Details</h2>
          <BackButton/>
        </div>

        <form class="form" @submit.prevent="getConsumerData">
          <label for="id" class="required drop">Consumer ID:</label>
          <select id="id" v-model="id" name="id" required>
            <option v-for="id in conList" v-bind:value="id" v-bind:key="id">
              {{ id }}
            </option>
          </select>
          <input type="submit" value="Retrieve Details">
        </form>

        <div class="card">
          <div class="card-body">
            <table>
              <tbody>
              <tr>
                <td>Name</td>
                <td>:</td>
                <td>{{ this.name }}</td>
              </tr>
              <tr>
                <td>Token Balance</td>
                <td>:</td>
                <td>{{ this.balance }}</td>
              </tr>
              <tr>
                <td>Emissions</td>
                <td>:</td>
                <td>{{ this.emissions }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading Web3...</div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: 'ConsumerProfile',
  components: {BackButton},
  data() {
    return {
      id: 'NIL',
      name: 'NIL',
      balance: 'NIL',
      emissions: 'NIL',
      conList: [],
      web3Ready: false
    };
  },
  async mounted() {
    await this.initContractService();
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
        const conList = await this.$contractService.getConsumerList();
        console.log('conList', conList);
        this.conList = conList;
      } catch (error) {
        console.error('Error setting up consumer list:', error);
      }
    },
    async getConsumerData() {
      try {
        const consumerId = parseInt(this.id);
        
        const name = await this.$contractService.getConsumerName(consumerId);
        const balance = await this.$contractService.getConsumerCredits(consumerId);
        const emissions = await this.$contractService.getConsumerEmissions(consumerId);

        console.log('name', name);
        console.log('balance', balance);
        console.log('emissions', emissions);

        this.name = name;
        this.balance = balance;
        this.emissions = emissions;

        const display = `Successfully retrieved Consumer ${this.id}'s details`;
        this.$bvToast.toast(display, {
          title: 'Successful',
          autoHideDelay: 5000,
          variant: 'success'
        });
      } catch (error) {
        console.error('Error getting consumer data:', error);
        this.$bvToast.toast('Error getting consumer data: ' + error.message, {
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

/* Sidenav */
.profile {
  margin-bottom: 20px;
  margin-top: -12px;
  text-align: center;
}

.profile img {
  border-radius: 50%;
  box-shadow: 0 0 5px 1px grey;
}

.name {
  font-size: 20px;
  font-weight: bold;
  padding-top: 20px;
}

.userType {
  font-size: 16px;
  font-weight: bold;
  padding-top: 10px;
}

/* Main */
.main .card {
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 1px 1px 8px 0 grey;
  height: auto;
  margin-bottom: 20px;
  padding: 20px 0 20px 50px;
}

.main .card table {
  border: none;
  font-size: 18px;
  height: 270px;
  width: 40%;
}

.row {
  display: flex;
  height: calc(100vh - 100px - 80px)
}

.left {
  background-color: #fff;
  color: #333;
  text-align: center;
  padding: 50px 30px 30px;
  flex: 30%;
  margin-top: 30px;
}

.right {
  padding: 40px;
  flex: 65%;
  text-align: left;
  margin-right: 40px;
}

#title {
  display: flex;
  align-items: center;
  height: 10%;
}

#title h2 {
  margin-bottom: 0;
  margin-right: auto;
}

.form {
  margin: 20px 0;
}

.form label {
  margin-right: 10px;
  font-weight: bold;
}

.form select {
  width: 120px;
  margin-right: 20px;
}

input[type="submit"] {
  padding: 5px;
  width: 15%;
  border-radius: 10px;
  border: 1px solid #2d3f55;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
}

input[type="submit"]:hover {
  background: #103B1D;
  border: solid 1px #2d3f55;
  color: white;
}
</style>