import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  getDocs,
  where
} from "firebase/firestore";
import { 
  ref, 
  set, 
  get, 
  onValue, 
  push, 
  update,
  child
} from "firebase/database";
import { auth, firestore, realtimeDb } from "../firebase.js";

class FirebaseService {
  constructor() {
    this.auth = auth;
    this.firestore = firestore;
    this.realtimeDb = realtimeDb;
  }

  // Authentication Methods
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      });

      // Store additional user data in Firestore
      await setDoc(doc(this.firestore, 'users', user.uid), {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date(),
        ...userData
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // User Profile Methods
  async getUserProfile(userId) {
    try {
      const docRef = doc(this.firestore, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUserProfile(userId, data) {
    try {
      const docRef = doc(this.firestore, 'users', userId);
      await updateDoc(docRef, data);
    } catch (error) {
      throw error;
    }
  }

  // Market Data Methods (Realtime Database)
  async updateMarketData(data) {
    try {
      const marketRef = ref(this.realtimeDb, 'market');
      await set(marketRef, {
        ...data,
        timestamp: Date.now()
      });
    } catch (error) {
      throw error;
    }
  }

  onMarketDataChange(callback) {
    const marketRef = ref(this.realtimeDb, 'market');
    return onValue(marketRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  // Live Price Tracking (Realtime Database)
  async updateCarbonPrice(price, change) {
    try {
      const priceRef = ref(this.realtimeDb, 'prices/carbon');
      await set(priceRef, {
        price: price,
        change: change,
        timestamp: Date.now()
      });
    } catch (error) {
      throw error;
    }
  }

  onPriceChange(callback) {
    const priceRef = ref(this.realtimeDb, 'prices');
    return onValue(priceRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  // Trading Methods (Firestore)
  async createTrade(tradeData) {
    try {
      const tradesRef = collection(this.firestore, 'trades');
      const docRef = await addDoc(tradesRef, {
        ...tradeData,
        createdAt: new Date(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getUserTrades(userId) {
    try {
      const tradesRef = collection(this.firestore, 'trades');
      const q = query(
        tradesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const trades = [];
      querySnapshot.forEach((doc) => {
        trades.push({ id: doc.id, ...doc.data() });
      });
      return trades;
    } catch (error) {
      throw error;
    }
  }

  onTradesChange(callback) {
    const tradesRef = collection(this.firestore, 'trades');
    const q = query(tradesRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const trades = [];
      snapshot.forEach((doc) => {
        trades.push({ id: doc.id, ...doc.data() });
      });
      callback(trades);
    });
  }

  // Carbon Credits Management (Firestore)
  async allocateCredits(userId, amount, validatorId) {
    try {
      const creditsRef = collection(this.firestore, 'credits');
      const docRef = await addDoc(creditsRef, {
        userId: userId,
        amount: amount,
        validatorId: validatorId,
        type: 'allocation',
        createdAt: new Date(),
        status: 'active'
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getUserCredits(userId) {
    try {
      const creditsRef = collection(this.firestore, 'credits');
      const q = query(
        creditsRef, 
        where('userId', '==', userId),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      let totalCredits = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalCredits += data.amount;
      });
      return totalCredits;
    } catch (error) {
      throw error;
    }
  }

  // Emissions Reporting (Firestore)
  async reportEmissions(userId, emissions, validatorId) {
    try {
      const emissionsRef = collection(this.firestore, 'emissions');
      const docRef = await addDoc(emissionsRef, {
        userId: userId,
        emissions: emissions,
        validatorId: validatorId,
        createdAt: new Date(),
        verified: true
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  // Notifications (Realtime Database)
  async sendNotification(userId, message, type = 'info') {
    try {
      const notificationsRef = ref(this.realtimeDb, `notifications/${userId}`);
      await push(notificationsRef, {
        message: message,
        type: type,
        timestamp: Date.now(),
        read: false
      });
    } catch (error) {
      throw error;
    }
  }

  onNotifications(userId, callback) {
    const notificationsRef = ref(this.realtimeDb, `notifications/${userId}`);
    return onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      const notifications = data ? Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })) : [];
      callback(notifications);
    });
  }

  // Initialize sample market data
  async initializeSampleData() {
    try {
      // Initialize market data
      await this.updateMarketData({
        carbonPrice: 85.50,
        priceChange: 2.3,
        volume24h: 15420000,
        marketCap: 2847000000,
        totalSupply: 33294117
      });

      // Initialize price history
      const priceHistoryRef = ref(this.realtimeDb, 'priceHistory');
      const sampleHistory = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        sampleHistory.push({
          date: date.toISOString(),
          price: 85.50 + (Math.random() - 0.5) * 10,
          volume: 15000000 + Math.random() * 5000000
        });
      }
      await set(priceHistoryRef, sampleHistory);

    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }
}

export default new FirebaseService();