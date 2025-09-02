import Web3 from 'web3';
import CarbonCreditArtifact from '@/contracts/CarbonCredit.json';
import MarketPlaceArtifact from '@/contracts/MarketPlace.json';

class ContractService {
  constructor() {
    this.web3 = null;
    this.contracts = {};
    this.accounts = [];
    this.contractAddresses = {
<<<<<<< HEAD
      CarbonCredit: '0x03f21DD4dC82d9A3D28809845DE6dfb2B22a24dC',
      MarketPlace: '0x1b37c29bDd76D23069584e4397D11c009376F06B'
=======
      CarbonCredit: '0x23E4ADd7998aFc4BD734db9dc399b653B389E064',
      MarketPlace: '0x7B58B17A0488eFB539133B23F630EAE8d415749B'
>>>>>>> 5be176ef15967a8a0d6d513490cc0eb3854073a6
    };
  }

  async initWeb3() {
    try {
      // Check if Web3 has been injected by MetaMask
      if (typeof window.ethereum !== 'undefined') {
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
        throw new Error('No accounts found. Make sure Ganache is running or MetaMask is connected.');
      }
      
      // Initialize contracts
      await this.initContracts();
      
      console.log('Web3 initialized successfully with', this.accounts.length, 'accounts');
      console.log('Connected to:', this.web3.currentProvider.host || 'MetaMask');
      
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
    return await contract.methods.getQty().call();
  }

  async getNumListings() {
    const contract = this.getContract('MarketPlace');
    return await contract.methods.getNumListings().call();
  }

  // Additional methods for complete functionality
  async createValidator(validatorAddress) {
    const contract = this.getContract('CarbonCredit');
    const account = this.getCurrentAccount();
    
    return await contract.methods.createValidator(validatorAddress).send({
      from: account,
      gas: 1000000
    });
  }

  async getConsumerName(consumerId) {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getConsumerName(consumerId).call();
  }

  async getGeneratorName(generatorId) {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getGeneratorName(generatorId).call();
  }

  async getConsumerEmissions(consumerId) {
    const contract = this.getContract('CarbonCredit');
    return await contract.methods.getConsumerEmissions(consumerId).call();
  }

  async getLastNumFilled() {
    const contract = this.getContract('MarketPlace');
    return await contract.methods.getLastNumFilled().call();
  }

  async getLastAvgPriceFilled() {
    const contract = this.getContract('MarketPlace');
    return await contract.methods.getLastAvgPriceFilled().call();
  }

  async approve(spender, amount) {
    const contract = this.getContract('CarbonCredit');
    const account = this.getCurrentAccount();
    
    return await contract.methods.approve(spender, amount).send({
      from: account,
      gas: 1000000
    });
  }

  async getMarketPlaceAddress() {
    return this.contractAddresses.MarketPlace;
  }
}

export default new ContractService();
