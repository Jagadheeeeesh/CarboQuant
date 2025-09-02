<template>
  <div class="login-container" :style="{backgroundImage: `url(${image})`}">
    <div class="login-card">
      <h2 class="card-header">Login</h2>
      <div class="card-body">
        <div v-if="error" class="alert alert-error">{{ error }}</div>
        <form @submit.prevent="submit" class="login-form">
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
          
          <button type="submit" class="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import con from "@/assets/consumer.jpg";

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        role: ""
      },
      error: null,
      image: con
    };
  },
  computed: {
    isDevMode() {
      return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    }
  },
  methods: {
    submit() {
      // Development mode bypass for testing
      const isDevMode = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
      
      if (isDevMode && this.form.email && this.form.password && this.form.role) {
        // Create a mock user for development
        const mockUser = {
          uid: `dev-${this.form.role}-${Date.now()}`,
          email: this.form.email,
          role: this.form.role
        };
        
        // Store mock user in Vuex store
        this.$store.dispatch("fetchUser", mockUser);
        
        // Redirect to role-specific page
        this.$router.replace({path: `/${this.form.role}`});
        return;
      }
      
      // Production Firebase authentication
      firebase
          .auth()
          .signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(() => {
            this.$router.replace({path: `/${this.form.role}`});
          })
          .catch(err => {
            this.error = err.message;
          });
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
  max-width: 400px;
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

.login-form {
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
  color: #333; /* Added dark color for input text */
}

.form-group input::placeholder {
  color: #666; /* Added color for placeholder text */
}

.form-group select option {
  color: #333; /* Added dark color for select options */
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

.login-button {
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

.login-button:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--glow-accent);
}
</style>