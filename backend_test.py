#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Carbon Credit Trading Platform
Tests blockchain smart contract functionality via Web3.py
"""

import json
import time
import sys
from web3 import Web3

class CarbonCreditTester:
    def __init__(self):
        # Connect to Ganache
        self.w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
        
        # Contract addresses from deployment
        self.carbon_credit_address = '0x23E4ADd7998aFc4BD734db9dc399b653B389E064'
        self.marketplace_address = '0x7B58B17A0488eFB539133B23F630EAE8d415749B'
        
        # Load contract ABIs
        self.carbon_credit_abi = self.load_abi('/app/vapp/src/contracts/CarbonCredit.json')
        self.marketplace_abi = self.load_abi('/app/vapp/src/contracts/MarketPlace.json')
        
        # Initialize contracts
        self.carbon_credit = self.w3.eth.contract(
            address=self.carbon_credit_address,
            abi=self.carbon_credit_abi
        )
        self.marketplace = self.w3.eth.contract(
            address=self.marketplace_address,
            abi=self.marketplace_abi
        )
        
        # Get accounts
        self.accounts = self.w3.eth.accounts
        self.regulator = self.accounts[0]  # Contract owner
        self.validator = self.accounts[1]
        self.generator = self.accounts[2]
        self.consumer = self.accounts[3]
        
        # Test results
        self.test_results = []
        
    def load_abi(self, file_path):
        """Load contract ABI from JSON file"""
        try:
            with open(file_path, 'r') as f:
                contract_json = json.load(f)
                return contract_json['abi']
        except Exception as e:
            print(f"Error loading ABI from {file_path}: {e}")
            return None
    
    def log_test(self, test_name, success, message=""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'status': status
        }
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        return success
    
    def test_web3_connection(self):
        """Test Web3 connection to Ganache"""
        try:
            connected = self.w3.is_connected()
            latest_block = self.w3.eth.block_number
            return self.log_test(
                "Web3 Connection", 
                connected, 
                f"Connected to Ganache, latest block: {latest_block}"
            )
        except Exception as e:
            return self.log_test("Web3 Connection", False, f"Connection failed: {e}")
    
    def test_contract_deployment(self):
        """Test that contracts are deployed and accessible"""
        try:
            # Test CarbonCredit contract
            cc_owner = self.carbon_credit.functions.getContractOwner().call()
            cc_deployed = cc_owner == self.regulator
            
            # Test MarketPlace contract
            mp_owner = self.marketplace.functions.marketplaceOwner().call()
            mp_deployed = mp_owner == self.regulator
            
            success = cc_deployed and mp_deployed
            message = f"CarbonCredit owner: {cc_owner}, MarketPlace owner: {mp_owner}"
            
            return self.log_test("Contract Deployment", success, message)
        except Exception as e:
            return self.log_test("Contract Deployment", False, f"Error: {e}")
    
    def test_validator_creation(self):
        """Test creating a validator"""
        try:
            # Create validator
            tx_hash = self.carbon_credit.functions.createValidator(self.validator).transact({
                'from': self.regulator,
                'gas': 1000000
            })
            
            # Wait for transaction
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return self.log_test(
                "Validator Creation", 
                True, 
                f"Validator created: {self.validator}"
            )
        except Exception as e:
            return self.log_test("Validator Creation", False, f"Error: {e}")
    
    def test_generator_creation(self):
        """Test creating generators"""
        try:
            # Create generator with unique ID
            import random
            generator_id = random.randint(10000, 99999)
            generator_name = "GreenTech Solar Farm"
            
            tx_hash = self.carbon_credit.functions.createGenerator(
                generator_id, generator_name, self.generator
            ).transact({
                'from': self.regulator,
                'gas': 1000000
            })
            
            # Wait for transaction
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Check if transaction was successful
            if receipt['status'] != 1:
                return self.log_test("Generator Creation", False, "Transaction failed")
            
            # Verify generator exists
            exists = self.carbon_credit.functions.isGenerator(generator_id).call()
            credits = self.carbon_credit.functions.getGeneratorCredits(generator_id).call()
            name = self.carbon_credit.functions.getGeneratorName(generator_id).call()
            
            success = exists and credits == 0 and name == generator_name
            message = f"Generator {generator_id}: exists={exists}, credits={credits}, name='{name}'"
            
            # Store for later tests
            self.test_generator_id = generator_id
            
            return self.log_test("Generator Creation", success, message)
        except Exception as e:
            return self.log_test("Generator Creation", False, f"Error: {e}")
    
    def test_consumer_creation(self):
        """Test creating consumers"""
        try:
            # Create consumer
            consumer_id = 2001
            consumer_name = "EcoManufacturing Corp"
            
            tx_hash = self.carbon_credit.functions.createConsumer(
                consumer_id, consumer_name, self.consumer
            ).transact({
                'from': self.regulator,
                'gas': 1000000
            })
            
            # Wait for transaction
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Verify consumer exists
            exists = self.carbon_credit.functions.isConsumer(consumer_id).call()
            credits = self.carbon_credit.functions.getConsumerCredits(consumer_id).call()
            name = self.carbon_credit.functions.getConsumerName(consumer_id).call()
            
            success = exists and credits == 100 and name == consumer_name  # Consumers start with 100 credits
            message = f"Consumer {consumer_id}: exists={exists}, credits={credits}, name='{name}'"
            
            return self.log_test("Consumer Creation", success, message)
        except Exception as e:
            return self.log_test("Consumer Creation", False, f"Error: {e}")
    
    def test_credit_allocation(self):
        """Test allocating credits to generators"""
        try:
            generator_id = 1001
            credit_amount = 250
            
            # Allocate credits
            tx_hash = self.carbon_credit.functions.allocateCredit(
                generator_id, credit_amount
            ).transact({
                'from': self.validator,
                'gas': 1000000
            })
            
            # Wait for transaction
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Verify credits allocated
            credits = self.carbon_credit.functions.getGeneratorCredits(generator_id).call()
            
            success = credits == credit_amount
            message = f"Generator {generator_id} credits: {credits} (expected: {credit_amount})"
            
            return self.log_test("Credit Allocation", success, message)
        except Exception as e:
            return self.log_test("Credit Allocation", False, f"Error: {e}")
    
    def test_emission_reporting(self):
        """Test reporting emissions for consumers"""
        try:
            consumer_id = 2001
            emission_amount = 75
            
            # Report emissions
            tx_hash = self.carbon_credit.functions.reportEmissions(
                consumer_id, emission_amount
            ).transact({
                'from': self.validator,
                'gas': 1000000
            })
            
            # Wait for transaction
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Verify emissions reported
            emissions = self.carbon_credit.functions.getConsumerEmissions(consumer_id).call()
            
            success = emissions == emission_amount
            message = f"Consumer {consumer_id} emissions: {emissions} (expected: {emission_amount})"
            
            return self.log_test("Emission Reporting", success, message)
        except Exception as e:
            return self.log_test("Emission Reporting", False, f"Error: {e}")
    
    def test_marketplace_listing(self):
        """Test listing credits on marketplace"""
        try:
            generator_id = 1001
            price = 50  # Price per credit
            quantity = 100  # Number of credits to sell
            
            # First approve marketplace to transfer tokens
            marketplace_address = self.marketplace.address
            tx_hash = self.carbon_credit.functions.approve(
                marketplace_address, quantity
            ).transact({
                'from': self.generator,
                'gas': 1000000
            })
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # List credits on marketplace
            tx_hash = self.marketplace.functions.listCredit(
                generator_id, price, quantity
            ).transact({
                'from': self.generator,
                'gas': 1000000
            })
            
            # Wait for transaction
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Verify listing
            num_listings = self.marketplace.functions.getNumListings().call()
            prices = self.marketplace.functions.getPrices().call()
            quantities = self.marketplace.functions.getQty().call()
            
            success = num_listings > 0 and price in prices and quantity in quantities
            message = f"Listings: {num_listings}, Prices: {prices}, Quantities: {quantities}"
            
            return self.log_test("Marketplace Listing", success, message)
        except Exception as e:
            return self.log_test("Marketplace Listing", False, f"Error: {e}")
    
    def test_marketplace_purchase(self):
        """Test purchasing credits from marketplace"""
        try:
            consumer_id = 2001
            purchase_quantity = 50
            
            # Get initial consumer credits
            initial_credits = self.carbon_credit.functions.getConsumerCredits(consumer_id).call()
            
            # Approve marketplace to transfer tokens for payment
            marketplace_address = self.marketplace.address
            tx_hash = self.carbon_credit.functions.approve(
                marketplace_address, purchase_quantity
            ).transact({
                'from': self.regulator,  # Regulator pays for the purchase
                'gas': 1000000
            })
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Buy credits
            tx_hash = self.marketplace.functions.buyCredit(
                consumer_id, purchase_quantity
            ).transact({
                'from': self.consumer,
                'gas': 1000000
            })
            
            # Wait for transaction
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Verify purchase
            final_credits = self.carbon_credit.functions.getConsumerCredits(consumer_id).call()
            last_filled = self.marketplace.functions.getLastNumFilled().call()
            
            success = final_credits > initial_credits and last_filled > 0
            message = f"Credits: {initial_credits} -> {final_credits}, Filled: {last_filled}"
            
            return self.log_test("Marketplace Purchase", success, message)
        except Exception as e:
            return self.log_test("Marketplace Purchase", False, f"Error: {e}")
    
    def test_compliance_checking(self):
        """Test compliance violation detection"""
        try:
            # Create a consumer with high emissions to trigger violation
            violator_id = 2002
            violator_name = "HighEmissions Inc"
            
            # Create consumer
            tx_hash = self.carbon_credit.functions.createConsumer(
                violator_id, violator_name, self.accounts[4]
            ).transact({
                'from': self.regulator,
                'gas': 1000000
            })
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Report high emissions (more than their 100 initial credits)
            high_emissions = 150
            tx_hash = self.carbon_credit.functions.reportEmissions(
                violator_id, high_emissions
            ).transact({
                'from': self.validator,
                'gas': 1000000
            })
            self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Check for violations
            violations = self.carbon_credit.functions.checkEmissions().call({
                'from': self.regulator
            })
            
            # violations returns (IDs, balances, emissions, exceeded_by)
            violator_ids, balances, emissions, exceeded_by = violations
            
            success = len(violator_ids) > 0 and violator_id in violator_ids
            message = f"Violations found: {len(violator_ids)}, IDs: {violator_ids}"
            
            return self.log_test("Compliance Checking", success, message)
        except Exception as e:
            return self.log_test("Compliance Checking", False, f"Error: {e}")
    
    def test_user_lists(self):
        """Test retrieving user lists"""
        try:
            # Get generator and consumer lists
            generator_list = self.carbon_credit.functions.getGeneratorList().call()
            consumer_list = self.carbon_credit.functions.getConsumerList().call()
            
            success = len(generator_list) > 0 and len(consumer_list) > 0
            message = f"Generators: {generator_list}, Consumers: {consumer_list}"
            
            return self.log_test("User Lists", success, message)
        except Exception as e:
            return self.log_test("User Lists", False, f"Error: {e}")
    
    def test_gas_usage(self):
        """Test gas usage for transactions"""
        try:
            # Test a simple transaction and check gas usage
            generator_id = 1002
            generator_name = "Wind Power Co"
            
            # Estimate gas
            gas_estimate = self.carbon_credit.functions.createGenerator(
                generator_id, generator_name, self.accounts[5]
            ).estimate_gas({
                'from': self.regulator
            })
            
            # Execute transaction
            tx_hash = self.carbon_credit.functions.createGenerator(
                generator_id, generator_name, self.accounts[5]
            ).transact({
                'from': self.regulator,
                'gas': gas_estimate
            })
            
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            gas_used = receipt['gasUsed']
            
            success = gas_used <= gas_estimate and gas_used > 0
            message = f"Gas estimated: {gas_estimate}, used: {gas_used}"
            
            return self.log_test("Gas Usage", success, message)
        except Exception as e:
            return self.log_test("Gas Usage", False, f"Error: {e}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Carbon Credit Trading Platform Backend Tests")
        print("=" * 60)
        
        # Core infrastructure tests
        self.test_web3_connection()
        self.test_contract_deployment()
        
        # User management tests
        self.test_validator_creation()
        self.test_generator_creation()
        self.test_consumer_creation()
        
        # Credit management tests
        self.test_credit_allocation()
        self.test_emission_reporting()
        
        # Marketplace tests
        self.test_marketplace_listing()
        self.test_marketplace_purchase()
        
        # Compliance and monitoring tests
        self.test_compliance_checking()
        self.test_user_lists()
        
        # Performance tests
        self.test_gas_usage()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['message']:
                print(f"    └─ {result['message']}")
        
        # Overall status
        if passed == total:
            print("\n🎉 ALL TESTS PASSED! System is fully functional.")
            return True
        else:
            print(f"\n⚠️  {total - passed} tests failed. System needs attention.")
            return False

def main():
    """Main test execution"""
    try:
        tester = CarbonCreditTester()
        success = tester.run_all_tests()
        
        # Exit with appropriate code
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"❌ CRITICAL ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()