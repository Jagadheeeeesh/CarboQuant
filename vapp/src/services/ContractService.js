import Web3 from 'web3';

class ContractService {
  constructor() {
    this.web3 = null;
    this.contracts = {};
    this.accounts = [];
    this.contractAddresses = {
      CarbonCredit: '0x23E4ADd7998aFc4BD734db9dc399b653B389E064',
      MarketPlace: '0x7B58B17A0488eFB539133B23F630EAE8d415749B'
    };
    this.contractABIs = {
      CarbonCredit: [], // Placeholder - will be loaded when needed
      MarketPlace: []   // Placeholder - will be loaded when needed
    };
  }

  async initWeb3() {
    try {
      // Check if Web3 has been injected by MetaMask
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        this.web3 = new Web3(window.ethereum);
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          console.log('MetaMask access denied, falling back to Ganache');
          this.web3 = new Web3('http://127.0.0.1:7545');
        }
      } else {
        // Fallback to local development node (Truffle Develop)
        this.web3 = new Web3('http://127.0.0.1:9545');
      }

      // Get accounts
      this.accounts = await this.web3.eth.getAccounts();
      
      if (this.accounts.length === 0) {
        console.warn('No accounts found. Contract functionality will be limited.');
        return false;
      }
      
      console.log('Web3 initialized successfully with', this.accounts.length, 'accounts');
      console.log('Connected to:', this.web3.currentProvider.host || 'MetaMask');
      
      return true;
    } catch (error) {
      console.warn('Web3 not available, contract functionality will be limited:', error.message);
      return false;
    }
  }

  async initContracts() {
    try {
      if (!this.web3) {
        throw new Error('Web3 not initialized');
      }

      // For now, we'll skip contract initialization until ABI files are available
      console.log('Contract initialization skipped - ABI files not available');
      return true;
    } catch (error) {
      console.error('Error initializing contracts:', error);
      return false;
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

  // Mock methods for development
  async allocateCredit(generatorId, credits) {
    console.log('Mock: Allocating credits', { generatorId, credits });
    return { transactionHash: '0x' + Math.random().toString(16).slice(2) };
  }

  async getGeneratorList() {
    console.log('Mock: Getting generator list');
    return ['gen1', 'gen2', 'gen3'];
  }

  async getConsumerList() {
    console.log('Mock: Getting consumer list');
    return ['cons1', 'cons2', 'cons3'];
  }

  async getGeneratorCredits(generatorId) {
    console.log('Mock: Getting generator credits', generatorId);
    return Math.floor(Math.random() * 1000) + 100;
  }

  async getConsumerCredits(consumerId) {
    console.log('Mock: Getting consumer credits', consumerId);
    return Math.floor(Math.random() * 500) + 50;
  }

  async createGenerator(generatorId, name, address) {
    console.log('Mock: Creating generator', { generatorId, name, address });
    return { transactionHash: '0x' + Math.random().toString(16).slice(2) };
  }

  async createConsumer(consumerId, name, address) {
    console.log('Mock: Creating consumer', { consumerId, name, address });
    return { transactionHash: '0x' + Math.random().toString(16).slice(2) };
  }

  async reportEmissions(consumerId, emissions) {
    console.log('Mock: Reporting emissions', { consumerId, emissions });
    return { transactionHash: '0x' + Math.random().toString(16).slice(2) };
  }

  async checkEmissions() {
    console.log('Mock: Checking emissions');
    return ['consumer1', 'consumer2'];
  }

  async listCredit(firmId, price, quantity) {
    console.log('Mock: Listing credit', { firmId, price, quantity });
    return { transactionHash: '0x' + Math.random().toString(16).slice(2) };
  }

  async buyCredit(firmId, quantity) {
    console.log('Mock: Buying credit', { firmId, quantity });
    return { transactionHash: '0x' + Math.random().toString(16).slice(2) };
  }

  async getPrices() {
    console.log('Mock: Getting prices');
    return [85, 87, 83, 90, 88];
  }

  async getQuantities() {
    console.log('Mock: Getting quantities');
    return [100, 150, 200, 75, 300];
  }

  async getNumListings() {
    console.log('Mock: Getting number of listings');
    return 5;
  }
}

export default new ContractService();
