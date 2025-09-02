<template>  <div v-if="web3Ready" id="wrapper">
    <div id="title">
      <h2>Create User</h2>
      <BackButton/>
    </div>
    <hr style="margin: 0">
    <div id="content">
      <form class="form" @submit.prevent="onSubmit">
        <label for="dropdown" class="required drop">User Type:</label>
        <select id="dropdown" required v-model="userType" name="userType">
          <option value="generator">Generator</option>
          <option value="consumer">Consumer</option>
        </select>
        <br>
        <label for="id" class="required">ID:</label>
        <input id="id" required v-model="id" name='id' type="text"/>
        <br>
        <label for="name" class="required">Name:</label>
        <input id="name" required v-model='name' name='name' type="text"/>
        <br>
        <br>
        <label></label>
        <input style='font-weight: bold;' type="submit" value="Send">
      </form>
    </div>
  </div>
  <div v-else>Loading Web3...</div>
</template>

<script>
import BackButton from "@/components/BackButton";

export default {
  name: 'createUser',
  components: {BackButton},
  data() {
    return {
      userType: '',
      id: '',
      name: '',
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
    async onSubmit() {
      if (!this.web3Ready) {
        alert("Blockchain connection not ready");
        return;
      }

      try {
        console.log('userType: ', this.userType);
        console.log('id: ', this.id);
        console.log('name: ', this.name);

        const accounts = this.$contractService.getAccounts();
        const userAddress = accounts[0]; // Using first account as user address
        const userId = parseInt(this.id);

        if (this.userType === 'generator') {
          await this.$contractService.createGenerator(userId, this.name, userAddress);
          
          const display = `Generator ${this.name} with ID ${this.id} has been created successfully.`;
          this.$bvToast.toast(display, {
            title: 'Generator Created',
            autoHideDelay: 5000,
            variant: 'success'
          });
        } else if (this.userType === 'consumer') {
          await this.$contractService.createConsumer(userId, this.name, userAddress);
          
          const display = `Consumer ${this.name} with ID ${this.id} has been created successfully.`;
          this.$bvToast.toast(display, {
            title: 'Consumer Created',
            autoHideDelay: 5000,
            variant: 'success'
          });
        }

        // Clear form
        this.userType = '';
        this.id = '';
        this.name = '';
      } catch (error) {
        console.error('Error creating user:', error);
        this.$bvToast.toast('Error creating user: ' + error.message, {
          title: 'Error',
          autoHideDelay: 5000,
          variant: 'danger'
        });
      }
    }
  }
};
</script>

    }
  },
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