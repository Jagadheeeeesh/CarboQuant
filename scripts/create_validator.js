const { Web3 } = require('web3');
const CarbonCreditArtifact = require('../vapp/src/contracts/CarbonCredit.json');

async function createValidator() {
  try {
    // Connect to Ganache
    const web3 = new Web3('http://127.0.0.1:7545');
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    console.log('Available accounts:', accounts.length);
    
    // Contract address from deployment
    const contractAddress = '0x23E4ADd7998aFc4BD734db9dc399b653B389E064';
    
    // Initialize contract
    const contract = new web3.eth.Contract(CarbonCreditArtifact.abi, contractAddress);
    
    // Create validator using second account as validator
    console.log('Creating validator with address:', accounts[1]);
    const result = await contract.methods.createValidator(accounts[1]).send({
      from: accounts[0], // Regulator account
      gas: 1000000
    });
    
    console.log('Validator created successfully!');
    console.log('Transaction hash:', result.transactionHash);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating validator:', error);
    process.exit(1);
  }
}

createValidator();