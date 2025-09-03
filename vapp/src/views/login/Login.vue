<template>
  <div class="login-container" :style="{backgroundImage: `url(${image})`}">
    <div class="login-card">
      <h2 class="card-header">Login to CarboQuant</h2>
      <div class="card-body">
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <div v-if="loading" class="loading-spinner">
          <i class="ri-loader-line"></i>
          Authenticating...
        </div>
        
        <form @submit.prevent="submit" class="login-form" v-if="!loading">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autofocus
              v-model="form.email"
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              v-model="form.password"
              placeholder="Enter your password"
            />
          </div>
          
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" required v-model="form.role">
              <option value="" disabled>Select your role</option>
              <option value="regulator">Regulator</option>
              <option value="validator">Validator</option>
              <option value="consumer">Consumer</option>
              <option value="generator">Generator</option>
            </select>
          </div>
          
          <button type="submit" class="login-button" :disabled="loading">
            <i class="ri-login-circle-line"></i>
            Login
          </button>
        </form>
        
        <div class="form-divider">
          <span>or</span>
        </div>
        
        <div class="register-section">
          <p>Don't have an account?</p>
          <button @click="showRegister = !showRegister" class="register-toggle">
            {{ showRegister ? 'Back to Login' : 'Create Account' }}
          </button>
        </div>
        
        <form @submit.prevent="register" class="register-form" v-if="showRegister && !loading">
          <div class="form-group">
            <label for="regName">Full Name</label>
            <input
              id="regName"
              type="text"
              required
              v-model="registerForm.name"
              placeholder="Enter your full name"
            />
          </div>
          
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input
              id="regEmail"
              type="email"
              required
              v-model="registerForm.email"
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label for="regPassword">Password</label>
            <input
              id="regPassword"
              type="password"
              required
              v-model="registerForm.password"
              placeholder="Create a password"
              minlength="6"
            />
          </div>
          
          <div class="form-group">
            <label for="regRole">Role</label>
            <select id="regRole" required v-model="registerForm.role">
              <option value="" disabled>Select your role</option>
              <option value="regulator">Regulator</option>
              <option value="validator">Validator</option>
              <option value="consumer">Consumer</option>
              <option value="generator">Generator</option>
            </select>
          </div>
          
          <button type="submit" class="register-button" :disabled="loading">
            <i class="ri-user-add-line"></i>
            Create Account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import con from "@/assets/consumer.jpg";

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: "",
        password: "",
        role: ""
      },
      registerForm: {
        name: "",
        email: "",
        password: "",
        role: ""
      },
      error: null,
      loading: false,
      showRegister: false,
      image: con
    };
  },
  computed: {
    isDevMode() {
      return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    }
  },
  methods: {
    async submit() {
      this.error = null;
      this.loading = true;
      
      try {
        // Development mode bypass for testing
        if (this.isDevMode && this.form.email === 'dev@test.com') {
          const mockUser = {
            uid: `dev-${this.form.role}-${Date.now()}`,
            email: this.form.email,
            displayName: `Dev ${this.form.role}`,
            role: this.form.role
          };
          
          this.$store.dispatch("fetchUser", mockUser);
          this.$store.dispatch("setUserProfile", { role: this.form.role });
          
          // Send welcome notification
          await this.$firebaseService.sendNotification(
            mockUser.uid,
            `Welcome to CarboQuant! You are logged in as ${this.form.role}.`,
            'success'
          );
          
          this.$router.replace({path: `/${this.form.role}`});
          return;
        }
        
        // Production Firebase authentication
        const user = await this.$firebaseService.signIn(this.form.email, this.form.password);
        
        // Get user profile
        const profile = await this.$firebaseService.getUserProfile(user.uid);
        
        if (profile && profile.role === this.form.role) {
          this.$store.dispatch("setUserProfile", profile);
          
          // Send login notification
          await this.$firebaseService.sendNotification(
            user.uid,
            `Welcome back! You are logged in as ${profile.role}.`,
            'success'
          );
          
          this.$router.replace({path: `/${profile.role}`});
        } else {
          this.error = "Role mismatch or user profile not found.";
        }
        
      } catch (err) {
        this.error = err.message || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    
    async register() {
      this.error = null;
      this.loading = true;
      
      try {
        const userData = {
          name: this.registerForm.name,
          email: this.registerForm.email,
          role: this.registerForm.role,
          createdAt: new Date(),
          credits: 1000 // Initial credits for new users
        };
        
        const user = await this.$firebaseService.signUp(
          this.registerForm.email,
          this.registerForm.password,
          userData
        );
        
        this.$store.dispatch("setUserProfile", userData);
        
        // Send welcome notification
        await this.$firebaseService.sendNotification(
          user.uid,
          `Welcome to CarboQuant! Your account has been created successfully. You start with 1000 carbon credits.`,
          'success'
        );
        
        this.$toasted.show('Account created successfully!', {
          type: 'success',
          duration: 3000
        });
        
        this.$router.replace({path: `/${userData.role}`});
        
      } catch (err) {
        this.error = err.message || "Registration failed. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background-size: cover;
  background-position: center;
}

.login-card {
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}

.card-header {
  background: rgba(45, 226, 160, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  padding: 24px;
  margin: 0;
  font-size: 2rem;
  text-align: center;
  font-family: 'Syne', sans-serif;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-body {
  padding: 32px;
}

.login-form,
.register-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #006400;
  font-size: 1.1rem;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-md);
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #333;
}

.form-group input::placeholder {
  color: #666;
}

.form-group select option {
  color: #333;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb), 0.2);
}

.alert {
  padding: 12px 16px;
  border-radius: var(--border-radius-md);
  margin-bottom: 24px;
}

.alert-error {
  background: rgba(255, 235, 238, 0.9);
  color: var(--error-color);
  border: 1px solid #ffcdd2;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--accent-primary);
  font-weight: 600;
}

.loading-spinner i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-button,
.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--glass-bg);
  color: #006400;
  border: 1px solid var(--glass-border);
  padding: 16px;
  border-radius: var(--border-radius-md);
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: var(--shadow-lg);
}

.login-button:hover,
.register-button:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--glow-accent);
}

.login-button:disabled,
.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-divider {
  text-align: center;
  margin: 1rem 0;
  position: relative;
}

.form-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--glass-border);
}

.form-divider span {
  background: rgba(255, 255, 255, 0.3);
  padding: 0 1rem;
  color: var(--text-secondary);
}

.register-section {
  text-align: center;
  margin: 1rem 0;
}

.register-section p {
  margin: 0 0 0.5rem 0;
  color: #006400;
}

.register-toggle {
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.register-toggle:hover {
  color: var(--accent-secondary);
}

@media (max-width: 768px) {
  .login-card {
    max-width: 100%;
    margin: 0 1rem;
  }
  
  .card-header {
    font-size: 1.5rem;
    padding: 1.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style>