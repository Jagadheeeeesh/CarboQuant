<template>
  <div v-if="web3Ready" id="wrapper">
    <div id="title">
      <h2>Report Emissions</h2>
      <BackButton/>
    </div>
    <hr style="margin: 0">
    <div id="content">
      <form @submit.prevent="reportEmissions">
        <label for="conId" class="required">Consumer ID:</label>
        <input id="conId" required v-model="conId" name="conId" type="text">
        <br>
        <label for="conEmissions" class="required">Emissions to report:</label>
        <input id="conEmissions" required v-model="conEmissions" name="conEmissions" type="text">
        <br><br>
        <label></label>
        <input type="submit">
      </form>
    </div>
  </div>
  <div v-else>Loading Web3...</div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: 'ReportEmissions',
  components: {BackButton},
  data() {
    return {
      conId: '',
      conEmissions: '',
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
    async reportEmissions() {
      if (!this.web3Ready) {
        alert("Blockchain connection not ready");
        return;
      }

      try {
        console.log('conId: ', this.conId);
        console.log('conEmissions: ', this.conEmissions);

        const conList = await this.$contractService.getConsumerList();
        const conIdNumber = parseInt(this.conId);
        
        if (conList.some(id => parseInt(id) === conIdNumber)) {
          await this.$contractService.reportEmissions(conIdNumber, this.conEmissions);

          const display = `Consumer ID ${this.conId} was reported with ${this.conEmissions} emissions.`;
          this.$bvToast.toast(display, {
            title: 'Successful',
            autoHideDelay: 5000,
            variant: 'success'
          });

          // Clear form
          this.conId = '';
          this.conEmissions = '';
        } else {
          const display = `Consumer ID ${this.conId} has not been created. Please specify an ID that exists.`;
          this.$bvToast.toast(display, {
            title: 'Unsuccessful',
            autoHideDelay: 5000,
            variant: 'danger'
          });
        }
      } catch (error) {
        console.error('Error reporting emissions:', error);
        this.$bvToast.toast('Error reporting emissions: ' + error.message, {
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

form {
  padding: 20px;
}

label {
  padding: 8px;
  display: inline-block;
  margin: 20px 0 10px;
  width: 15%;
  text-align: left;
  font-weight: bold;
}

input[type="text"], input[type="submit"], select {
  display: inline-block;
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