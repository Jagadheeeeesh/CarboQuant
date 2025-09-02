import Web3 from 'web3';
import CarbonCreditArtifact from '@/contracts/CarbonCredit.json';
import MarketPlaceArtifact from '@/contracts/MarketPlace.json';

class ContractService {
  constructor() {
    this.web3 = null;
    this.contracts = {};
    this.accounts = [];    this.contractAddresses = {
      CarbonCredit: '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
      MarketPlace: '0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb'
    };
  }

  async initWeb3() {
    try {
      // Check if Web3 has been injected by MetaMask
      if (typeof window.ethereum !== 'undefined') {
        this.web3 = new Web3(window.ethereum);
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        // Fallback to local development node
        this.web3 = new Web3('http://127.0.0.1:9545');
      }

      // Get accounts
      this.accounts = await this.web3.eth.getAccounts();
      
      // Initialize contracts
      await this.initContracts();
      
      return true;
    } catch (error) {
      console.error('Error initializing Web3:', error);
      return false;
    }
  }

  async initContracts() {
    try {
      // Initialize CarbonCredit contract
      this.contracts.CarbonCredit = new this.web3.eth.Contract(
        CarbonCreditArtifact.abi,
        this.contractAddresses.CarbonCredit
      );

      // Initialize MarketPlace contract
      this.contracts.MarketPlace = new this.web3.eth.Contract(
        MarketPlaceArtifact.abi,
        this.contractAddresses.MarketPlace
      );

      console.log('Contracts initialized successfully');
    } catch (error) {
      console.error('Error initializing contracts:', error);
      throw error;
    }
  }

  getContract(contractName) {
    return this.contracts[contractName];
  }

  getWeb3() {
    return this.web3;
  }

  getAccounts() {
    return this.accounts;
  }

  getCurrentAccount() {
    return this.accounts[0];
  }

  // Carbon Credit Contract Methods
  async allocateCredit(generatorId, credits) {
    const contract = this.getContract('CarbonCredit');
    const account = this.getCurrentAccount();
    
    return await contract.methods.allocateCredit(generatorId, credits).send({
      from: account,
      gas: 1000000
    });
  }

  async getGeneratorList() {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getGeneratorList().call();
  }

  async getConsumerList() {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getConsumerList().call();
  }

  async getGeneratorCredits(generatorId) {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getGeneratorCredits(generatorId).call();
  }

  async getConsumerCredits(consumerId) {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getConsumerCredits(consumerId).call();
  }

  async createGenerator(generatorId, name, address) {
    const contract = this.getContract('CarbonCredit');
    const account = this.getCurrentAccount();
    
    return await contract.methods.createGenerator(generatorId, name, address).send({
      from: account,
      gas: 1000000
    });
  }

  async createConsumer(consumerId, name, address) {
    const contract = this.getContract('CarbonCredit');
    const account = this.getCurrentAccount();
    
    return await contract.methods.createConsumer(consumerId, name, address).send({
      from: account,
      gas: 1000000
    });
  }

  async reportEmissions(consumerId, emissions) {
    const contract = this.getContract('CarbonCredit');
    const account = this.getCurrentAccount();
    
    return await contract.methods.reportEmissions(consumerId, emissions).send({
      from: account,
      gas: 1000000
    });
  }

  async checkEmissions() {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.checkEmissions().call();
  }

  // MarketPlace Contract Methods
  async listCredit(firmId, price, quantity) {
    const contract = this.getContract('MarketPlace');
    const account = this.getCurrentAccount();
    
    return await contract.methods.listCredit(firmId, price, quantity).send({
      from: account,
      gas: 1000000
    });
  }

  async buyCredit(firmId, quantity) {
    const contract = this.getContract('MarketPlace');
    const account = this.getCurrentAccount();
    
    return await contract.methods.buyCredit(firmId, quantity).send({
      from: account,
      gas: 1000000
    });
  }

  async getPrices() {
    const contract = this.getContract('MarketPlace');
    return await contract.methods.getPrices().call();
  }

  async getQuantities() {
    const contract = this.getContract('MarketPlace');
    return await contract.methods.getQuantities().call();
  }

  async getNumListings() {
    const contract = this.getContract('MarketPlace');
    return await contract.methods.getNumListings().call();
  }
}

export default new ContractService();
