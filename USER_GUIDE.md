# 🚀 HOW TO USE YOUR CARBON CREDIT TRADING SYSTEM

## 📋 Quick Start Guide

Your system is currently running at: **http://localhost:8080**

---

## 🔐 Step 1: How to Login (No Account Creation Needed!)

### 🎉 **GOOD NEWS: The system works in DEVELOPMENT MODE!**

You can login with **ANY** email and password combination. The system will automatically create a session for you.

### Login Steps:

1. **Go to**: http://localhost:8080/login
2. **Enter ANY email**: example@email.com (or anything you want)
3. **Enter ANY password**: password123 (or anything you want)
4. **Select your role**: Choose from:
   - **Regulator** - System admin who creates users
   - **Validator** - Verifies projects and allocates credits
   - **Generator** - Creates and sells carbon credits
   - **Consumer** - Buys carbon credits
5. **Click Login**

### 🎯 **No account creation needed** - it's automatic in development mode!

---

## 👥 Step 2: Understanding User IDs

### What is an ID?

- **ID = User Identification Number** (like 1, 2, 3, etc.)
- Each Generator and Consumer needs a **unique numeric ID**
- This ID is used throughout the system to identify users

### Who Creates IDs?

- **Regulators** create Generator and Consumer IDs
- You must be logged in as a **Regulator** to create new users

---

## 🏗️ Step 3: System Setup Workflow

### First Time Setup (Do this first!):

#### A) **Login as Regulator**

1. Go to http://localhost:8080/login
2. Email: `admin@carboconnect.com`
3. Password: `admin123`
4. Role: **Regulator**
5. Click Login

#### B) **Create a Generator**

1. Navigate to: **Regulator** → **Create User**
2. User Type: **Generator**
3. ID: `1` (or any number)
4. Name: `Green Energy Corp`
5. Click **Send**

#### C) **Create a Consumer**

1. Same page as above
2. User Type: **Consumer**
3. ID: `1` (or any number)
4. Name: `Manufacturing Inc`
5. Click **Send**

#### D) **Create a Validator** (Do this in truffle console)

```bash
# In your truffle develop console, run:
let accounts = await web3.eth.getAccounts()
let contract = await CarbonCredit.deployed()
await contract.createValidator(accounts[1])
```

---

## 💰 Step 4: How to Get Credits

### For Generators (Credit Sellers):

#### **Login as Validator First:**

1. Login with Validator role
2. Go to: **Validator** → **Allocate Credits**
3. Generator ID: `1` (the ID you created)
4. Credits: `100` (or any amount)
5. Click **Submit**

Now the Generator with ID 1 has 100 credits!

### For Consumers (Credit Buyers):

- **Consumers start with 100 credits automatically** when created
- They can buy more credits from the marketplace

---

## 🛒 Step 5: How to Use the Marketplace

### **Selling Credits (as Generator):**

1. **Login as Generator**
2. Go to: **Generator** → **Market**
3. Fill in:
   - **Your ID**: `1` (your generator ID)
   - **Price**: `50` (price per credit)
   - **Quantity**: `10` (how many to sell)
4. Click **List Credit**

### **Buying Credits (as Consumer):**

1. **Login as Consumer**
2. Go to: **Consumer** → **Market**
3. Fill in:
   - **Your ID**: `1` (your consumer ID)
   - **Quantity**: `5` (how many to buy)
4. Click **Buy Credit**

---

## 📊 Step 6: How to Check Your Credits

### **View Generator Credits:**

1. Login as Generator
2. Go to: **Generator** → **Profile**
3. Enter your ID: `1`
4. Click **Get Data**
5. See your credit balance

### **View Consumer Credits:**

1. Login as Consumer
2. Go to: **Consumer** → **Profile**
3. Enter your ID: `1`
4. Click **Get Data**
5. See your credit balance and emissions

---

## 🎮 Complete Example Walkthrough

### **Step-by-Step Demo:**

#### 1️⃣ **Setup Phase (as Regulator)**

```
http://localhost:8080/login
Email: admin@carboconnect.com
Password: admin123
Role: Regulator
→ Login → Create User
→ Type: Generator, ID: 1, Name: "Solar Farm Co" → Send
→ Type: Consumer, ID: 1, Name: "Steel Factory" → Send
```

#### 2️⃣ **Allocate Credits (as Validator)**

```
Login again with Validator role
→ Validator → Allocate Credits
→ Generator ID: 1, Credits: 200 → Submit
```

#### 3️⃣ **List Credits for Sale (as Generator)**

```
Login again with Generator role
→ Generator → Market
→ ID: 1, Price: 25, Quantity: 50 → List Credit
```

#### 4️⃣ **Buy Credits (as Consumer)**

```
Login again with Consumer role
→ Consumer → Market
→ ID: 1, Quantity: 10 → Buy Credit
```

#### 5️⃣ **Check Results**

```
Generator Profile: See remaining credits (200 - 50 = 150)
Consumer Profile: See total credits (100 + 10 = 110)
```

---

## 🔍 Where to Find Your Information

### **Your Credits are shown in:**

- **Generator Profile** page (for generators)
- **Consumer Profile** page (for consumers)
- **Market** pages show real-time trading data

### **Transaction History:**

- Check browser console (F12) for transaction details
- Success/error messages appear as popup notifications
- All transactions are recorded on the blockchain

---

## 🚨 Common Issues & Solutions

### **"User ID not found"**

- **Solution**: Create the user first as a Regulator

### **"Insufficient credits"**

- **Solution**: Allocate more credits as a Validator (for generators)
- **Solution**: Buy more credits from marketplace (for consumers)

### **"Price already listed"**

- **Solution**: Use a different price when listing credits

### **Blockchain connection errors**

- **Solution**: Make sure truffle develop is running
- **Solution**: Refresh the page and try again

---

## 🎯 Quick Reference

### **URLs to Remember:**

- **Home**: http://localhost:8080
- **Login**: http://localhost:8080/login
- **Regulator Dashboard**: http://localhost:8080/regulator
- **Validator Dashboard**: http://localhost:8080/validator
- **Generator Dashboard**: http://localhost:8080/generator
- **Consumer Dashboard**: http://localhost:8080/consumer

### **Default Test Accounts:**

- **Regulator**: admin@carboconnect.com / admin123
- **Validator**: validator@carboconnect.com / validator123
- **Generator**: generator@carboconnect.com / generator123
- **Consumer**: consumer@carboconnect.com / consumer123

### **Sample Data for Testing:**

- **Generator IDs**: 1, 2, 3, etc.
- **Consumer IDs**: 1, 2, 3, etc.
- **Credit Amounts**: 50, 100, 200, etc.
- **Prices**: 10, 25, 50, 100, etc.

---

## 🎉 You're Ready to Go!

**Now you can:**
✅ Login with any role  
✅ Create users (as Regulator)  
✅ Allocate credits (as Validator)  
✅ Trade credits in the marketplace  
✅ Monitor balances and transactions  
✅ Track environmental compliance

**Start with the Regulator role to set up your first users, then explore all the features!** 🚀

---

_Need help? Check the browser console (F12) for detailed transaction information and error messages._
