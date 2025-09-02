<template>  <div v-if="web3Ready" id="wrapper">
    <div id="title">
      <h2>Allocate Credits</h2>
      <BackButton/>
    </div>
    <hr style="margin: 0">
    <div id="content">
      <form @submit.prevent="allocateCredit">
        <label for="genId" class="required">Generator ID:</label>
        <input id="genId" required v-model="genId" name="genId" type="text">
        <br>
        <label for="credits" class="required">Credits to allocate:</label>
        <input id="credits" required v-model="genCredits" name="genCredits" type="text">
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
  name: 'AllocateCredits',
  components: {BackButton},
  data() {
    return {
      genId: '',
      genCredits: '',
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
    async allocateCredit() {
      if (!this.web3Ready) {
        alert("Blockchain connection not ready");
        return;
      }

      try {
        console.log('genId: ', this.genId);
        console.log('genCredits: ', this.genCredits);

        // Check if generator exists
        const genList = await this.$contractService.getGeneratorList();
        const genIdNumber = parseInt(this.genId);
        
        if (genList.some(id => parseInt(id) === genIdNumber)) {
          // Allocate credit
          await this.$contractService.allocateCredit(genIdNumber, this.genCredits);

          const display = `Generator ID ${this.genId} has been allocated ${this.genCredits} credits.`;
          this.$bvToast.toast(display, {
            title: 'Successful',
            autoHideDelay: 5000,
            variant: 'success'
          });

          // Clear form
          this.genId = '';
          this.genCredits = '';
        } else {
          const display = `Generator ID ${this.genId} has not been created. Please specify an ID that exists.`;
          this.$bvToast.toast(display, {
            title: 'Unsuccessful',
            autoHideDelay: 5000,
            variant: 'danger'
          });
        }
      } catch (error) {
        console.error('Error allocating credit:', error);
        this.$bvToast.toast('Error allocating credit: ' + error.message, {
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