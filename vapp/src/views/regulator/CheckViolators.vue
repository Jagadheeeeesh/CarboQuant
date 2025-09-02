<template>
  <div v-if="web3Ready" id="wrapper">
    <div id="title">
      <h2>Check Violators</h2>
      <BackButton/>
    </div>
    <hr style="margin: 0">
    <div id="content">
      <form @submit.prevent="checkEmissions">
        <input type="submit" value="Retrieve violators">
      </form>

      <table class="table">
        <thead style="background: #103B1D; color: white;">
        <tr style='width:18%'>
          <td class="border"><strong>Consumers</strong></td>
          <td class="border"><strong>Credit Balance</strong></td>
          <td class="border"><strong>Actual Emissions</strong></td>
          <td class="border"><strong>Exceeded Amount</strong></td>
        </tr>
        </thead>

        <tbody>
        <tr v-for="item in itemsList" :key="item.user">
          <td class="border" style="width:18%">{{ item.user }}</td>
          <td class="border" style="width:18%">{{ item.balance }}</td>
          <td class="border" style="width:18%">{{ item.emissions }}</td>
          <td class="border" style="width:18%; color:red">{{ item.diff }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else>Loading Web3...</div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: 'checkViolators',
  components: {BackButton},
  data() {
    return {
      itemsList: [],
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
    async checkEmissions() {
      if (!this.web3Ready) {
        alert("Blockchain connection not ready");
        return;
      }

      try {
        const result = await this.$contractService.checkEmissions();
        console.log('result', result);

        this.itemsList = []; // resetting itemsList

        if (result[0].length === 0) {
          const display = `There are no violators.`;
          this.$bvToast.toast(display, {
            title: 'Information',
            autoHideDelay: 5000,
          });
        } else {
          for (let i = 0; i < result[0].length; i++) {
            this.itemsList.push({
              user: result[0][i],
              balance: result[1][i],
              emissions: result[2][i],
              diff: result[3][i],
            });
          }

          let display = "";
          if (result[0].length === 1) {
            display = `Successfully retrieved ${result[0].length} violator.`;
          } else {
            display = `Successfully retrieved ${result[0].length} violators.`;
          }
          this.$bvToast.toast(display, {
            title: 'Successful',
            autoHideDelay: 5000,
            variant: 'success'
          });
        }
      } catch (error) {
        console.error('Error checking emissions:', error);
        this.$bvToast.toast('Error checking emissions: ' + error.message, {
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
  align-items: center;
  justify-content: center;
  height: 80%;
}

.table {
  width: 70%;
  margin: 20px auto 40px;
}

.border {
  border: solid 1px lightgrey
}

input[type="submit"] {
  padding: 8px;
  width: 30%;
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

div {
  padding: 20px;
}
</style>