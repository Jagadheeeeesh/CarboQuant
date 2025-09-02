
const CarbonCredit = artifacts.require('CarbonCredit');
CarbonCredit.deployed().then(instance => {
  const accounts = web3.eth.getAccounts();
  return accounts.then(accs => {
    console.log('Available accounts:', accs);
    // Create validator using first account as validator
    return instance.createValidator(accs[1], {from: accs[0]});
  });
}).then(result => {
  console.log('Validator created successfully:', result.tx);
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

